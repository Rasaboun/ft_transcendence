export interface Iuser {
	blockedUsers:  string[],
	id: number,
	intraLogin:string,
	lobbyId:string,
	password: string,
	photoUrl: string,
	roomId: string,
	status: number,
	username: string,
	gameStats: GameStats,

}

export interface Imatch {
    playerOneLogin: string;
    playerTwoLogin: string;
    playerOneScore: number;
    playerTwoScore: number;
	winnerLogin: string;
}

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