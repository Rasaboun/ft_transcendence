import { Socket } from "socket.io";
import { Lobby } from "./lobby/lobby";
export interface Player {
    id: string;
    pos: number;
    score: number;
}
export interface Paddle {
    height: number;
    width: number;
}
export interface Ball {
    x: number;
    y: number;
    speed: number;
    delta: {
        x: number;
        y: number;
    };
    radius: number;
}
export interface GameData {
    players: Player[];
    ball: Ball;
    state: GameState;
}
export interface GameSettings {
    scoreToWin: number;
    paddleWidth: number;
    paddleHeight: number;
    width: number;
    height: number;
}
export declare type AuthenticatedSocket = Socket & {
    data: {
        lobby: null | Lobby;
    };
};
export declare enum GameState {
    Started = 0,
    Stopped = 1,
    Waiting = 2,
    Goal = 3
}
