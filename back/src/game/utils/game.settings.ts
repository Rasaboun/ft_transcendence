import { GameData, GameSettings, GameState } from "../types/game.type";

const scoreToWin = 10;

export function getNormalModeSettings(): GameSettings
{
    return {
        scoreToWin: scoreToWin,
        paddleHeight: 200,
        paddleWidth: 50,
        width: 1920,
        height: 1080,
    }
}

export function getMiniModeSettings(): GameSettings
{
    return {
        scoreToWin: scoreToWin,
        paddleHeight: 50,
        paddleWidth: 10,
        width: 1920,    
        height: 1080,
    }
}


export function initGameData(): GameData 
{
    return {
        players: [],
        ball: {
            x: 50,
            y: 50,
            speed: 25,
            radius: 20,
            delta: {x: 0, y: 0},
        },
        state: GameState.Waiting,
    }
}