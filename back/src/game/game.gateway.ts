import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { LobbyManager } from './lobby/lobby.manager';
import { GameMode, GameOptions, Player } from './types/game.type';
import { AuthenticatedSocket } from 'src/sessions/sessions.type';
import { SessionService } from 'src/sessions/sessions.service';


@WebSocketGateway(8002, { cors: '*', namespace: 'game' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	constructor( 	private lobbyManager: LobbyManager,
					private sessionManager: SessionService
				) {	}

	@WebSocketServer()
	server: Server;


	afterInit(server: Server) {
		
		this.lobbyManager.server = server;
	
	}

	async handleConnection(client: Socket){
		
		//this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
		console.log(`Client ${client.id} joined pong socket`);
		this.sessionManager.initializeSocket(client as AuthenticatedSocket);
		await this.lobbyManager.joinLobbies(client as AuthenticatedSocket);
		
	}

	handleDisconnect(client: AuthenticatedSocket) {
		this.lobbyManager.terminateSocket(client);
		console.log(`Client ${client.id} left pong socket`);
		
	}

	@SubscribeMessage('createLobby')
	createLobby(client: AuthenticatedSocket, /*options: GameOptions*/)
	{
		const options: GameOptions = {
			mode: GameMode.Normal,
			inviteMode: false,
		}
		let lobby = this.lobbyManager.createLobby(options);
		lobby.addClient(client);

		client.emit("lobbyCreated", "Successful creation");
	}

	@SubscribeMessage('joinedQueue')
	joiningQueue(client: AuthenticatedSocket, mode:GameMode)
	{
		console.log(`Client ${client.id} joined queue`)
		this.lobbyManager.joinQueue(client, mode);
	}

	@SubscribeMessage('joinInvitation')
	joinInvitation(client: AuthenticatedSocket, playerLogin: string)
	{
		try
		{
			this.lobbyManager.joinInvitation(client, playerLogin);
		} catch (error) { client.emit("error", error.message) };
	}

	@SubscribeMessage('spectacteGame')
	spectateGame(client: AuthenticatedSocket, lobbyId: string)
	{
		try {
			this.lobbyManager.joinLobby(lobbyId, client);
		}
		catch (error) { client.emit('lobbyNotFound', error.message ) }
	}

	@SubscribeMessage('getActiveGames')
	getActiveGames(client: AuthenticatedSocket)
	{
		//console.log(this.lobbyManager.getActiveLobbies())
		client.emit('activeGames', this.lobbyManager.getActiveLobbies());
	}


	@SubscribeMessage('startGame')
	launchGame(client: AuthenticatedSocket)
	{
		client.lobby.startGame();
	}

	@SubscribeMessage('playerMoved')
	handlePlayerPosition(client: AuthenticatedSocket, newPos: number) {

		const player: Player = client.lobby?.getPlayer(client.login);
		if (!player)
			return ;
		player.pos = newPos;
		client.lobby.sendToUsers('updatePaddle', {playerId: client.login, newPos: newPos});

	}
}
