import PlayerController from "./controllers/PlayerController";
import Pool from "./Pool";
import Room from "./Room";
import RoomManager from "./RoomManager";
import Models from "./types/models";

export default class Player {
    private socket: any;

    public id: string;
    public name: string | undefined;

    private research: boolean;
    private room: Room | undefined;

    constructor(socket: any) {
        this.socket = socket;
        this.id = socket.id;
        this.name = undefined;
        this.research = false;

        RoomManager.createRoom(this);

        const pc = new PlayerController(this);

        this.socket.on('GetPlayerInfo', pc.getPlayerInfo.bind(pc))
        this.socket.on('JoinRoom', pc.joinRoom.bind(pc));
        this.socket.on('UpdateName', pc.updateName.bind(pc))
        this.socket.on('GetRoomInfo', pc.getRoomInfo.bind(pc));
        this.socket.on('StartRoom', pc.startRoom.bind(pc));
        this.socket.on('QuitRoom', pc.quitRoom.bind(pc))
        this.socket.on('GetGameState', pc.getGameState.bind(pc))
        this.socket.on('Play', pc.play.bind(pc))
    }

    setName(name: string) : void {
        this.name = name.substring(0, 10);
    }

    setRoom(room: Room | null) : void {
        if (room) {
            this.room = room;
        } else {
            this.room = undefined;
            RoomManager.createRoom(this);
        }
        Pool.cancel(this);
    }

    getRoom() {
        return this.room;
    }

    setResearch (research: boolean) {
        this.research = research;
    }

    onLeave() {
        if (this.room) {
            this.room.leave(this)
        }
        Pool.cancel(this);
    }

    sendEvent<T>(name: string, event: T) {
        this.socket.emit(name, event)
    }

    toInfo() : Models.PlayerInfo {

        if (!this.room) {
            RoomManager.createRoom(this);
        }

        return {
            name: this.name,
            code: this.room?.code,
            research: this.research,
            id: this.id
        }
    }
}