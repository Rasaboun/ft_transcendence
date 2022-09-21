import { Socket } from "socket.io";
import { GameModule } from "../game.module";
import { Lobby } from "../lobby/lobby";

export interface Player 
{ 
    id: string,
    pos: number,
    score: number
}

export interface Paddle {
	height: number,
	width: number,
}

export interface Ball {
	x: number,
	y: number,
  speed: number,
  delta: {x: number, y: number},
	radius: number
}

export interface GameData{
  players: Player[],
  ball: Ball,
  state: GameState
}

export interface GameSettings {
  scoreToWin: number,
  paddleWidth:	number,
  paddleHeight:	number,
  width: number,
  height: number,  
}

export interface GameOptions {
  inviteMode: boolean,
  mode : GameMode,
}

export enum GameMode {
  Normal,
  Mini,
  Speed,
}

export enum GameState {
  Started,
  Stopped,
  Waiting,
  Goal,
}
