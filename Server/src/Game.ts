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
        tF: [500, 750, 1000],
        nextproba: [0.1, 0.2, 0.3]
    },
    {
        tbInterval: {
            min: 1500,
            max: 3000
        },
        tF: [600, 1000, 1500],
        nextproba: [0.3, 0.4, 0.5]
    },
    {
        tbInterval: {
            min: 3000,
            max: 7000
        },
        tF: [800, 1500, 2000],
        nextproba: [0.6, 0.4, 0.2]
    }
]


export default class Game {
    private room: Room;
    private playersID: string[] = [];
    private scores: number[] = [];

    private failed = false;
    private server: string | undefined;

    private nextStriker: string | undefined;
    private action: Action | undefined;
    private tBStart = 0;
    private tBDuration = 0;


    constructor(room: Room) {
        this.room = room;
        this.playersID = room.getPlayers().map((p) => p.id);
    }

    play(action: Action, player: Player) {
        if (!this.room.isStart()) throw ("La partie n'est pas lancé");
        this.strik(action, player.id);
        this.room.dispatchNewGameState();
    }

    strik (action: Action, playerID: string) {
        if (this.nextStriker === playerID && this.action) {
            const time = new Date().getTime();
            const diff = time - ( this.tBStart + this.tBDuration );
            const property = ActionsProperties[this.action];

            if (diff > 0) {
                if (diff < property.tF[0]) {
                    this.setNextStriker(FEEDBACK.EXCELLENT);
                } else if (diff < property.tF[1]) {
                    this.setNextStriker(FEEDBACK.SUPER);
                } else if (diff < property.tF[2]){
                    this.setNextStriker(FEEDBACK.PASSED);
                } else {
                    this.fail()
                }
            }
        }
    }

    setNextStriker (prevFeedback: FEEDBACK) {
        this.nextStriker = this.nextStriker === this.playersID[0]  ? this.playersID[1] : this.playersID[0];
        this.action = this.getRandomAction(prevFeedback);
        this.tBStart = new Date().getTime();

        const tbInterval = ActionsProperties[this.action].tbInterval;
        this.tBDuration = tbInterval.min + (Math.random() * (tbInterval.max - tbInterval.min))

        setTimeout(this.fail, this.tBDuration)
    }

    fail () {
        this.failed = true;
        this.setServer(this.nextStriker || this.playersID[0]);
    }

    setServer (playerID: string) {
        if (this.failed) {
            this.server = playerID;
        }
    }

    serv (playerID: string) {
        if (this.server === playerID) {
            this.failed = false;
            this.setNextStriker(FEEDBACK.PASSED)
        }
    }

    getRandomAction (feedback: FEEDBACK) {
        const r = Math.random();
        let a = 0;

        for(const value in Object.keys(Action)) {
            const action = Action[value as keyof typeof Action];
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
            score: [0,0]
        };
    }

}