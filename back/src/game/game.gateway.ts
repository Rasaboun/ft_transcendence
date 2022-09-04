import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { LobbyManager } from './lobby/lobby.manager';
import { AuthenticatedSocket, Player } from './game.type';


@WebSocketGateway(8002, { cors: '*' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	constructor( private lobbyManager: LobbyManager) {	}

	@WebSocketServer()
	server;


	afterInit(server: Server) {
		
		this.lobbyManager.server = server;
	
	}

	handleConnection(client: Socket){
		console.log(`Client ${client.id} joined server`);
		
		this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
		
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
			client.emit('spectateSuccess', client.data.lobby.gameInstance.getPlayers());
		}
		catch (error) { client.emit('lobbyNotFound', error.message ) }
	}

	@SubscribeMessage('destroyLobby')
	destroyLobby(client: AuthenticatedSocket)
	{
		this.lobbyManager.destroyLobby(client.data.lobby?.id);
	}

	@SubscribeMessage('getActiveGames')
	getActiveGames(client: AuthenticatedSocket)
	{
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
