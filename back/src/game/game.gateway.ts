import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { LobbyManager } from './lobby/lobby.manager';
import { GameMode, GameOptions, Player } from './types/game.type';
import { AuthenticatedSocket } from 'src/auth/types/auth.type';
import { AuthService } from 'src/auth/auth.service';
import { forwardRef, Inject } from '@nestjs/common';
import { isJWT } from 'class-validator';


@WebSocketGateway(8002, { cors: '*', namespace: 'game' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	constructor( 	private lobbyManager: LobbyManager,
					@Inject(forwardRef(() => AuthService))
					private authService: AuthService,
				) {	}

	@WebSocketServer()
	server: Server;


	afterInit(server: Server) {
		
		this.lobbyManager.server = server;
	
	}

	async handleConnection(client: AuthenticatedSocket){
		
		//this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
		console.log(`Client ${client.id} joined pong socket`);
		await this.authService.initializeSocket(client as AuthenticatedSocket);
		if (client.lobbyId)
			client.lobby = this.lobbyManager.getLobby(client.lobbyId);
		await this.lobbyManager.joinLobbies(client as AuthenticatedSocket);
		
	}

	handleDisconnect(client: AuthenticatedSocket) {
		this.lobbyManager.terminateSocket(client);
		console.log(`Client ${client.id} left pong socket`);
		
	}

	@SubscribeMessage('leftPong')
	leftPong(client: AuthenticatedSocket)
	{
		this.lobbyManager.leaveQueue(client);
	}

	@SubscribeMessage('createLobby')
	createLobby(client: AuthenticatedSocket, options: GameOptions)
	{
		let lobby = this.lobbyManager.createLobby(options);
		lobby.addClient(client);

		client.emit("lobbyCreated", "Successful creation");
	}

	@SubscribeMessage('joinedQueue')
	async joiningQueue(client: AuthenticatedSocket, mode: GameMode)
	{
		console.log(`Client ${client.id} joined queue`)
		await this.lobbyManager.joinQueue(client, mode);
	}

	@SubscribeMessage('joinInvitation')
	joinInvitation(client: AuthenticatedSocket, sender: string)
	{
		try
		{
			if (this.lobbyManager.joinInvitation(client, sender) == false)
			{
				client.emit("invitationExpired", "This lobby does not exist anymore");
			}
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
		client.emit('activeGames', this.lobbyManager.getActiveLobbies());
	}

	@SubscribeMessage('loadGame')
	async getGameInfo(client: AuthenticatedSocket)
	{
		try
		{

			await this.updateLobby(client);
			if (!client.lobby)
				return ;
			client.emit('gameData', client.lobby.getGameData())
		}
		catch (error) { throw error; }
	}

	@SubscribeMessage('startGame')
	async launchGame(client: AuthenticatedSocket)
	{
		await this.updateLobby(client);
		if (!client.lobby)
			return ;
		client.lobby.startGame();
	}

	@SubscribeMessage('playerMoved')
	async handlePlayerPosition(client: AuthenticatedSocket, newPos: number) {
		await this.updateLobby(client);
		if (!client.lobby)
			return ;
		const player: Player = client.lobby?.getPlayer(client.login);
		if (!player)
			return ;
		player.pos = newPos;
		client.join(client.roomId);	
		client.lobby.sendToUsers('updatePaddle', {playerId: client.login, newPos: newPos});

	}

	async updateLobby(client: AuthenticatedSocket)
	{
		client.lobbyId = await this.authService.getUserLobbyId(client.login);
		client.lobby = this.lobbyManager.getLobby(client.lobbyId);
	}
}
