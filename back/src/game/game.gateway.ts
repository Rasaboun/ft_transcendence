import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { LobbyManager } from './lobby/lobby.manager';
import { GameMode, GameOptions, GameState, Player } from './types/game.type';
import { AuthenticatedSocket } from 'src/auth/types/auth.type';
import { AuthService } from 'src/auth/auth.service';
import { forwardRef, Inject } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { UsersService } from 'src/users/users.service';
import { UserStatus } from 'src/users/type/users.type';
import { Lobby } from './lobby/lobby';
import { initGameData } from './utils/game.settings';


@WebSocketGateway(Number(process.env.SOCKET_PORT), { cors: '*', namespace: 'game' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	constructor( 	private lobbyManager: LobbyManager,
					@Inject(forwardRef(() => AuthService))
					private authService: AuthService,
					private usersService: UsersService,
				) {	}

	@WebSocketServer()
	server: Server;


	afterInit(server: Server) {
		
		this.lobbyManager.server = server;
	
	}

	async handleConnection(client: AuthenticatedSocket){
		
		console.log(`Client ${client.id} joined pong socket`);
		try
		{
			await this.authService.initializeSocket(client as AuthenticatedSocket);
			if (client.lobbyId)
				client.lobby = this.lobbyManager.getLobby(client.lobbyId);
			await this.lobbyManager.joinLobbies(client as AuthenticatedSocket);
		}
		catch ( error ) { client.emit('UserNotFound')}
		
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
	async createLobby(client: AuthenticatedSocket, options: GameOptions)
	{
		let lobby = this.lobbyManager.createLobby(options);
		await this.authService.updateLobby(client.login, lobby.id);
		lobby.addClient(client);

		client.emit("lobbyCreated", "Successful creation");
	}

	@SubscribeMessage('joinedQueue')
	async joiningQueue(client: AuthenticatedSocket, mode: GameMode)
	{
		await this.updateLobby(client);
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
			let data;
			if (!client.lobby)
			{
				data = initGameData();
				data.state = GameState.Stopped;
			}
			else
				data = client.lobby.getGameData();
			client.emit('gameData', data)
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
		this.updatePlayersStatus(client.lobby, UserStatus.ingame);		
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

    public async updatePlayersStatus(lobby: Lobby, status: UserStatus)
    {

		const playersLogin: string[] = lobby.playersId();
		await this.usersService.setUserStatus(playersLogin[0], status);
		await this.usersService.setUserStatus(playersLogin[1], status);
    }
}
