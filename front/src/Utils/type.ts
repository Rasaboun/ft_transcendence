export interface Iuser {
	blockedUsers:  string[],
	defeats: number,
	id: number,
	intraLogin:string,
	lobbyId:string,
	nbGames:number,
	password: string,
	photoUrl: string,
	roomId: string,
	status: number,
	username: string,
	victories: number

}

export interface Imatch {
    playerOneLogin: string;
    playerTwoLogin: string;
    playerOneScore: number;
    playerTwoScore: number;
	winnerLogin: string;
}