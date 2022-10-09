import { GameData, GameSettings, GameState } from "../types/game.type";

const scoreToWin = 5;

export function getNormalModeSettings(): GameSettings
{
    return {
        scoreToWin: scoreToWin,
        paddleHeight: 200,
        paddleWidth: 50,
        width: 1920,
        height: 1080,
        maxHits: 15,
    }
}

export function getMiniModeSettings(): GameSettings
{
    return {
        scoreToWin: scoreToWin,
        paddleHeight: 50,
        paddleWidth: 20,
        width: 1920,    
        height: 1080,
        maxHits: 10,
    }
}


export function initGameData(): GameData 
{
    return {
        players: [],
        ball: {
            x: 50,
            y: 50,
            speed: 10,
            radius: 20,
            delta: {x: 0, y: 0},
        },
        state: GameState.Waiting,
        nbHits: 0,
    }
}