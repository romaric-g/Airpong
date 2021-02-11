import { Action } from "../Game";

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
    startTimer?: number,
    start: boolean
  }

  interface GameState {
    nextStriker: string | undefined,
    server: string | undefined,
    tBStart: number,
    tBDuration: number,
    tFDuration: number,
    failed: boolean,
    score: number[],
    win?: WinState,
    leave?: boolean
  }

  interface WinState {
    winnerID: string | null
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
    action: Action
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
    info: RoomInfo
  }

  interface GameStateChangeEvent {
    state: GameState
  }
}

export default Models;
