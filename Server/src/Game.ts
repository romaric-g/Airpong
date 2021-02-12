import { Mode } from "fs";
import Player from "./Player";
import Room from "./Room";
import Models from "./types/models";

export enum Action {
    SMATCH,
    REVERS,
    DROIT
}

export enum FEEDBACK {
    EXCELLENT,
    SUPER,
    PASSED
}


interface ActionProperties {
    tbInterval: {
        min: number,
        max: number,
    },
    tF: number[],
    nextproba: Record<FEEDBACK, number>
}

const ActionsProperties: Record<Action, ActionProperties> = [
    {
        tbInterval: {
            min: 500,
            max: 1500
        },
        tF: [700, 1250, 2000],
        nextproba: [0.1, 0.2, 0.3]
    },
    {
        tbInterval: {
            min: 1500,
            max: 3000
        },
        tF: [900, 1750, 2500],
        nextproba: [0.3, 0.4, 0.5]
    },
    {
        tbInterval: {
            min: 3000,
            max: 5000
        },
        tF: [1100, 2000, 3000],
        nextproba: [0.6, 0.4, 0.2]
    }
]


export default class Game {
    private room: Room;
    private playersID: string[] = [];
    private scores: number[] = [0,0];

    private failed = false;
    private server: string | undefined;

    private nextStriker: string | undefined;
    private feedback: FEEDBACK | undefined;
    private action: Action | undefined;
    private tBStart = 0;
    private tBDuration = 0;

    private strikTimeout : NodeJS.Timeout | undefined;

    constructor(room: Room) {
        this.room = room;
    }

    start () {
        this.playersID = this.room.getPlayers().map((p) => p.id);

        this.setServer(this.playersID[Math.floor(Math.random() * this.playersID.length)])
    }

    play(action: Models.PlayActions, player: Player) {
        if (!this.room.isStart()) throw ("La partie n'est pas lancé");
        
        if (action === "serv") {
            this.serv(player.id);
        } else {
            console.log("PLAY", action, player.id)
            switch(action) {
                case 'droit':
                    this.strik(Action.DROIT, player.id);
                    break;
                case 'revers':
                    this.strik(Action.REVERS, player.id);
                    break;
                case 'smatch':
                    this.strik(Action.SMATCH, player.id);
                    break;
            }
            this.room.dispatchNewGameState();
        }

    }

    strik (action: Action, playerID: string) {
        console.log(action, this.action)
        if (this.nextStriker === playerID && this.action !== undefined && action === this.action) {
            const time = new Date().getTime();
            const diff = time - ( this.tBStart + this.tBDuration );
            const property = ActionsProperties[this.action];

            console.log(diff)

            if (diff > 0) {
                if (diff < property.tF[0]) {
                    console.log("EXCELLENT")
                    this.setNextStriker(action, FEEDBACK.EXCELLENT);
                } else if (diff < property.tF[1]) {
                    console.log("SUPER")
                    this.setNextStriker(action, FEEDBACK.SUPER);
                } else if (diff < property.tF[2]){
                    console.log("PASSED")
                    this.setNextStriker(action, FEEDBACK.PASSED);
                } else if (diff >= property.tF[2]){
                    console.log("FAIL")
                    this.fail()
                }
            }
        }
    }

    
    stick (nextStriker: string, fromAction: Action, prevFeedback: FEEDBACK | undefined) {
        this.cancelBallTimout();
        this.feedback = prevFeedback;
        this.nextStriker = nextStriker;
        this.action = this.getRandomAction(prevFeedback || FEEDBACK.PASSED);
        this.tBStart = new Date().getTime();

        const props = ActionsProperties[fromAction];
        const tbInterval = props.tbInterval;
        this.tBDuration = tbInterval.min + (Math.random() * (tbInterval.max - tbInterval.min))

        this.strikTimeout = setTimeout(this.fail.bind(this), this.tBDuration + props.tF[2]);
    }

    setNextStriker (prevAction: Action, prevFeedback: FEEDBACK) {
        const nextStriket = this.nextStriker ? this.getOpponent(this.nextStriker) : this.playersID[0];
        this.stick(nextStriket, prevAction, prevFeedback);
    }

    cancelBallTimout () {
        if (this.strikTimeout) {
            clearTimeout(this.strikTimeout);
            this.strikTimeout = undefined;
        }
    }

    fail () {
        this.failed = true;
        this.cancelBallTimout();
        if (this.nextStriker !== undefined) {
            this.addScore(this.getOpponent(this.nextStriker))
        }
        this.setServer(this.nextStriker || this.playersID[0]);
    }

    getOpponent (playerID: string) {
        return playerID === this.playersID[0]  ? this.playersID[1] : this.playersID[0]
    }

    setServer (playerID: string) {
        if (this.server === undefined) {
            this.server = playerID;
        }
        this.room.dispatchNewGameState();
    }

    serv (playerID: string) {
        if (this.server === playerID) {
            this.failed = false;
            this.server = undefined;

            this.stick(this.getOpponent(playerID), Action.DROIT, undefined)
        }
        this.room.dispatchNewGameState();
    }

    getRandomAction (feedback: FEEDBACK) {
        const r = Math.random();
        let a = 0;

        for(const value in Object.values(Action)) {
            const action = ( Number(value) ) as Action;
            const prop = ActionsProperties[action];
            a += prop.nextproba[feedback];
            if (a > r) return action;
        }
        return Action.DROIT;
    }

    addScore(playerID: string) {
        this.scores[this.playersID.indexOf(playerID)] += 1; 
    }

    reset () {
        // reset
    }

    getState (playerID: string) : Models.GameState {
        // get state
        return {
            nextStriker: this.nextStriker,
            failed: this.failed,
            server: this.server,
            tBStart: this.tBStart,
            tBDuration: this.tBDuration,
            tFDuration: this.action ? ActionsProperties[this.action].tF[2] : 0,
            feedback: this.feedback,
            action: this.action,
            score: this.scores,
            playersName: this.room.getPlayersName()
        };
    }

}