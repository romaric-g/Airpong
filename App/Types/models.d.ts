
declare namespace Models {

  interface SocketResponse {
    success: boolean,
    message?: string
  }

  interface PlayerSettings {
    name: string
  }

  interface PlayerInfo {
    name?: string,
    code: string | undefined,
    research: boolean,
    id: string
  }

  interface RoomInfo {
    alone: boolean,
    playersName: (string | undefined)[],
    code: string,
  }

  interface GameState {
    me: 0 | 1 | 2 ,
    currentPlayer: number,
    player1?: PlayerInfo,
    player2?: PlayerInfo,
    grid: number[][],
    lastPlacement: { x: number, y: number } | null,
    score: number[],
    win?: WinState,
    leave?: boolean
  }

  interface WinState {
    points: { x: number, y: number }[] | null,
    winnerID: string | null,
    scoreAdded: number
  }

  /* Params */

  interface JoinRoomParams {
    settings: PlayerSettings,
    code: string,
  }

  interface PlayerSettingParams {
    settings: PlayerSettings
  }

  interface PlayParams {
    column: number
  }


  /* Response */

  interface GetPlayerInfoResponse extends SocketResponse {
    playerInfo: PlayerInfo
  }

  interface GetRoomInfoResponse extends SocketResponse {
    roomInfo?: RoomInfo
  }

  interface GetGameStateResponse extends SocketResponse {
    state?: GameState
  }

  /* Evenement */

  interface RoomStartEvent {
    code: string
  }

  interface RoomInfoChangeEvent {
    reason: "kick" | "join" | "leave",
    playerName: string | undefined,
    info: RoomInfo
  }

  interface GameStateChangeEvent {
    state: GameState
  }
}

export default Models;
