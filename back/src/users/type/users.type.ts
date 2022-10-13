import { StringSchema } from "joi";

export enum UserStatus {
    offline,
    online,
    ingame,
}

export type Friend = {
    login: string,
    username: string,
    status: UserStatus,
}

export type GameStats = {
    victories: number,
    defeats: number,
    nbGames: number,
    goalsScored: number,
    goalsTaken: number,
}

export type MatchInfo = {
    winnerLogin: string,
    loserLogin: string,
    winnerScore: number,
    loserScore: number;
}

export function initGameStats(): GameStats
{
    return {
        victories: 0,
        defeats: 0,
        goalsScored: 0,
        goalsTaken: 0,
        nbGames: 0,
    }
}