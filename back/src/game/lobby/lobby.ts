import { v4 } from "uuid";
import { Server } from "socket.io";
import { GameData, GameOptions, GameState, Player } from "../types/game.type";
import { GameInstance } from "../game.instance";
import { AuthenticatedSocket } from 'src/auth/types/auth.type';
import { LobbyManager } from "./lobby.manager";

export class Lobby
{
    public readonly id:             string = v4();
    public          nbPlayers:      number = 0;
    public          state:          GameState = GameState.Stopped;

    public readonly gameInstance:   GameInstance;

    //public         clients:        	Map<string, AuthenticatedSocket> = new Map<string, AuthenticatedSocket>();
    public         clients:        	Map<string, string> = new Map<string, string>();

    constructor    (
                private server: Server,
                private options: GameOptions,
                private lobbyManager: LobbyManager,
        )
    {
        this.gameInstance = new GameInstance(this, options.mode);
    }

    public addClient(client: AuthenticatedSocket): void
    {
        this.clients.set(client.login, client.roomId);
        client.join(this.id);
        client.lobbyId = this.id;
        client.lobby = this;
        
        console.log(`Client ${client.login} joined`, this.id)
        
        if (this.nbPlayers < 2)
        {
            this.gameInstance.addPlayer(client.login);
            this.nbPlayers++;
            
            if (this.nbPlayers == 1)
            {
                this.server.to(client.roomId).emit("waitingForOpponent");
            }
            else
            {
                this.gameInstance.sendReady();
            }
        }
        else
        {
            const data = this.getGameData();
            client.emit("spectateSuccess", data);
        }
    }


    public startGame()
    {
		if (this.state == GameState.Started)
			return ;
		this.state = GameState.Started;
        this.gameInstance.resetRound();
		this.gameInstance.gameLoop();
        this.server.emit('activeGames', this.lobbyManager.getActiveLobbies());

    }

    public removeClient(client: AuthenticatedSocket)
    {
        client.lobby = null;
        client.leave(this.id);
        this.clients.delete(client.login);
		//this.gameInstance.stop();
        if (this.gameInstance.isPlayer(client.login))
        {
            this.clients.forEach((user, id) => {
                this.clients.delete(id);
            })

            this.nbPlayers = 0;
            this.state = GameState.Stopped;          
            this.sendToUsers('gameStopped', "");
        }          
    }
    
    public async destroy()
    {
        this.gameInstance.stop();
        this.nbPlayers = 0;
        this.state = GameState.Stopped;    

        this.sendToUsers('gameStopped', ""); 

        this.clients.forEach((user, id) => {
            this.clients.delete(id);
        })

        const clientSockets = await this.server.in(this.id).fetchSockets();
        clientSockets.forEach((socket) => {
            socket.leave(this.id);
        })

        this.lobbyManager.destroyLobby(this.id);
        this.server.emit('activeGames', this.lobbyManager.getActiveLobbies());

    }

    public playersId(): string[] { return this.gameInstance.playersId(); }

    public sendUpdate(event: string, data: any) { this.server.to(this.id).emit(event, data); }

    public needUpdate(event: string, data: GameData) { 
		const [firstClient] = this.clients.keys()
		this.server.to(firstClient).emit(event, data); 
    }

    public async sendToUsers(event: string, data: any)
    {
        this.clients.forEach((roomId, clientLogin) => {
            this.server.to(roomId).emit(event, data);
        })
    }

    public async gameOver(winnerLogin: string)
    {
        const winnerUsername = await this.lobbyManager.getPlayerUsername(winnerLogin);
        this.sendToUsers('gameOver', winnerUsername);
        this.destroy();
    }

    public playerMoved(playerLogin: string, newPos: number)
    {
        this.gameInstance.updatePlayer(playerLogin, newPos);
    }

	public getPlayer(clientLogin: string)
	{
		return this.gameInstance.getPlayer(clientLogin);
	}

    public getGameData()
    {
        return this.gameInstance.getGameData();
    }

    public getMode()
    {
        return this.options.mode;
    }

    public isClient(clientLogin: string): boolean
    {
        return this.clients.get(clientLogin) === undefined ? false : true;
    }

    public isPrivate(): boolean { return this.options.inviteMode; }
}