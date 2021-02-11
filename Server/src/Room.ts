import Models from "./types/models";
import Player from "./Player";
import RoomManager from "./RoomManager";
import Game from "./Game";

export default class Room {
    public readonly code: string;
    public game: Game;
    private players: Player[];
    private started = false;
    private startTimer: number | undefined;

    constructor(code: string) {
        this.code = code;
        this.players = [];
        this.game = new Game(this);
    }

    join(player: Player) : boolean {
        if (this.players.length >= 2) {
            return false;
        }
        if (this.players.includes(player)) {
            return false;
        }
        if (player.getRoom()) {
            player.onLeave();
        }
        this.players.push(player);
        player.setRoom(this);

        this.dispatchNewRoomInfo();
        this.tryAutoStart()
        return true;
    }

    leave(player: Player) : void {
        this.players = this.players.filter((p) => p != player)
        player.setRoom(null);
        if (this.players.length <= 0) {
            RoomManager.deleteRoom(this)
        }

        this.dispatchNewRoomInfo();
        this.dispatchNewGameState();
    }

    onDelete() {
        this.players.forEach((p) => p.setRoom(null))
    }

    getPlayers() {
        return this.players;
    }

    getPlayersName() {
        return this.players.map((player) => player.name);
    }

    start() {
        console.log("start")
        if (!this.started && this.players.length >= 2) {
            console.log("start ok")
            this.started = true;
            this.game = new Game(this);
            this.game.start();
            this.dispatchEvent<Models.RoomStartEvent>("RoomStart", () => ({
                code: this.code
            }));
            this.dispatchNewRoomInfo();
            this.dispatchNewGameState();
            return true;
        } else {
            return false;
        }
    }

    dispatchEvent<T>(name: string, event: (params: { playerID: string }) => T) {
        this.players.forEach((player) =>
            player.sendEvent<T>(name, event({ 
                playerID: player.id
            }))
        )
    }

    dispatchNewGameState() {
        console.log("DISPATCH GAME STATE")
        this.dispatchEvent<Models.GameStateChangeEvent>("GameStateChange", ({ playerID }) => (
            {
                state: this.game.getState(playerID)
            }
        ))
    }

    dispatchNewRoomInfo() {
        this.dispatchEvent<Models.RoomInfoChangeEvent>("RoomInfoChange", () => ({
            info: this.toInfo()
        }))
    }

    isStart () {
        return this.started;
    }

    alone () {
        return this.players.length === 1;
    }

    toInfo() : Models.RoomInfo {
        return {
            alone: this.alone(),
            playersName: this.getPlayersName(),
            code: this.code,
            start: this.started,
            startTimer: this.startTimer
        }
    }

    getGame() {
        return this.game;
    }

    canAutoStart () {
        return this.players.length === 2;
    }

    tryAutoStart () {
        const startTimer = (start: number) => {
            if (start) this.startTimer = start + 1;
            if (this.canAutoStart()) {
                if (this.startTimer !== undefined) {
                    console.log(this.startTimer)
                    this.startTimer--;
                    if (this.startTimer > 0) {
                        setTimeout(startTimer, 1000);
                        this.dispatchNewRoomInfo();
                    } else {
                        this.start();
                    }
                }
            } else {
                this.startTimer = undefined;
            }
        }
        console.log(this.canAutoStart(), "OUI")
        console.log(this.startTimer)
        if (this.startTimer === undefined && this.canAutoStart()) {
            startTimer(1);
        }
    }
}