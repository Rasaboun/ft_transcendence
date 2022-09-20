import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { LobbyManager } from './lobby/lobby.manager';
import { AuthenticatedSocket, Player } from './game.type';
import { SessionManager } from 'src/chat/sessions/sessions.manager';


@WebSocketGateway(8002, { cors: '*' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	constructor( 	private lobbyManager: LobbyManager,
					private sessionManager: SessionManager,
				) {	}

	@WebSocketServer()
	server: Server;


	afterInit(server: Server) {
		
		this.lobbyManager.server = server;
	
	}

	handleConnection(client: Socket){
		
		this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
		//this.sessionManager.initializeSocket(client as AuthenticatedSocket);
		//await this.lobbyManager.joinLobbies(client as AuthenticatedSocket);
		console.log(`Client ${client.id} joined pong socket`);
		
	}

	handleDisconnect(client: AuthenticatedSocket) {
		console.log(`Client ${client.id} left server`);
		this.lobbyManager.terminateSocket(client);
		
	}

	@SubscribeMessage('createLobby')
	createLobby(client: AuthenticatedSocket)
	{
		let lobby = this.lobbyManager.createLobby();
		lobby.addClient(client);

		client.emit("lobbyCreated", "Successful creation");
	}

	@SubscribeMessage('joinedQueue')
	joiningQueue(client: AuthenticatedSocket, player:Player)
	{
		console.log(`Client ${client.id} joined queue`)
		this.lobbyManager.joinQueue(client);
	}

	@SubscribeMessage('spectacteGame')
	spectateGame(client: AuthenticatedSocket, lobbyId: string)
	{
		try {
			this.lobbyManager.joinLobby(lobbyId, client);
			console.log('Joined lobby');
		}
		catch (error) { client.emit('lobbyNotFound', error.message ) }
	}

	@SubscribeMessage('getActiveGames')
	getActiveGames(client: AuthenticatedSocket)
	{
		console.log(this.lobbyManager.getActiveLobbies())
		client.emit('activeGames', this.lobbyManager.getActiveLobbies());
	}


	@SubscribeMessage('startGame')
	launchGame(client: AuthenticatedSocket)
	{
		client.data.lobby.startGame();
	}

	@SubscribeMessage('playerMoved')
	handlePlayerPosition(client: AuthenticatedSocket, newPos: number) {

		const player: Player = client.data.lobby?.getUser(client);
		if (!player)
			return ;
		player.pos = newPos;
		client.data.lobby.sendToUsers('updatePaddle', {playerId: client.id, newPos: newPos});

	}
}
