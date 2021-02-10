import Player from "./Player";
import Room from "./Room";

interface Position {
    x: number,
    y: number
}

export default class Grid {
    private room: Room;
    public readonly height = 6;
    public readonly width = 7;
    public points: number[][];
    public currentPlayerNumber = Math.floor(Math.random() * 2) + 1;
    public lastPlacement: Position | null = null; 

    constructor(room: Room) {
        this.room = room;
        this.points = [];
        for (let index = 0; index < 9; index++) {
            this.points[index] = [];
        }
    }

    play(column: number, player: Player) : Position {
        const playerNumber = this.room.getPlayerNumber(player);
        if (!this.points[column]) this.points[column] = [];
        if (!this.room.isState()) throw ("La partie n'est pas lancé");
        if (playerNumber === 0) throw ("Aucun joueur n'a été designé pour jouer");
        if (column >= this.width) throw ("La colonne n'existe pas");
        if (this.points[column].length >= this.height) throw ("Il n'y a plus de place sur cette colonne");
        if (this.currentPlayerNumber !== playerNumber) throw ("Ce n'est pas à vous de jouer");
        this.points[column].push(playerNumber);

        this.lastPlacement = {
            x: column,
            y: this.points[column].length -1
        };

        const sequances = this.findSequence(this.lastPlacement, playerNumber)
        const win = Object.values(sequances).some((sq) => sq.length >= 4)
        const equality = this.points.every((point) => point.length >= 6)

        if (win) {
            const points: Position[] = Array.prototype.concat.apply(
                [], 
                Object.values(sequances).filter((sq) => sq.length >= 4)
            );
            const scoreAdded = 100;
            this.room.setWin({
                winnerID: player.id,
                points: points,
                scoreAdded: scoreAdded
            })
            this.room.addScore(playerNumber, scoreAdded);
        } else if (equality) {
            this.room.setWin({
                winnerID: null,
                points: null,
                scoreAdded: 0
            })
        } else {
            this.next()
        }
        this.room.dispatchNewGameState();
        
        return this.lastPlacement;
    }

    findSequence(source: Position, playerNumber: number) {
        const searchDirections = [[-1,1],[0,1],[1,1],[1,0]];

        const checkDirection = (source: Position, direction: number[]) : Position[] => {
            const sequence: Position[] = [];
            const current = {
                x: (source.x + direction[0]),
                y: (source.y + direction[1])
            } 
            if (current.x >= this.width || current.y >= this.height || current.x < 0 || current.y < 0) return sequence;
            if (this.points[current.x][current.y] === playerNumber) {
                sequence.push(current)
                sequence.push(...checkDirection(current, direction))
            }
            return sequence;
        }

        const sequence: {[key: string]: Position[]} = {}

        for (let index = 0; index < searchDirections.length; index++) {
            const searchDirection = searchDirections[index];
            const searchDirectionOposite = [- searchDirection[0], - searchDirection[1]]
            sequence[index] = [...checkDirection(source, searchDirectionOposite), source, ...checkDirection(source, searchDirection)]
        }
        
        return sequence;
    }

    next() {
        this.currentPlayerNumber = this.currentPlayerNumber === 1 ? 2 : 1;
    }

    reset () {
        this.points = [];
        this.currentPlayerNumber = 1;
    }

}