import Player from "./Player";
import RoomManager from "./RoomManager";

class Pool {
    private players: Player[] = []
 
    put(player: Player) {
        this.players.push(player);

        this.check();
    }

    cancel(player: Player) {
        this.players = this.players.filter((p) => p !== player);
    }

    check() {
        if (this.players.length >= 2) {

            const player1 = this.players[0];
            const player2 = this.players[1];

            RoomManager.createRoom(player1).join(player2)

            this.cancel(player1)
            this.cancel(player2)

            this.check()
        } 
    }
}

export default new Pool();