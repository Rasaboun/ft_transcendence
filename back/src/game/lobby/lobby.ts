import { v4 } from "uuid";
import { Server } from "socket.io";
import { AuthenticatedSocket, GameData, GameState, Player } from "../game.type";
import { GameInstance } from "../game.instance";
import { Socket } from "dgram";

export class Lobby
{
    public readonly id:             string = v4();
    public          nbPlayers:      number = 0;
    public          state:          GameState = GameState.Stopped;
    public readonly inviteMode:     boolean;

    public readonly gameInstance:   GameInstance = new GameInstance(this);

    public         clients:        	Map<string, AuthenticatedSocket> = new Map<string, AuthenticatedSocket>();

    constructor    ( private server: Server ) {}

    public addClient(client: AuthenticatedSocket): void
    {
        this.clients.set(client.id, client);
        client.join(this.id);
        client.data.lobby = this;
        console.log(this.id)
        
        if (this.nbPlayers < 2)
        {
            this.gameInstance.addPlayer(client.id);
            this.nbPlayers++;
            
            if (this.nbPlayers == 1)
            {
                client.emit("waitingForOpponent");
            }
            else
            {
                this.gameInstance.sendReady();
            }
        }
        console.log("lobby client ", this.clients.size)
    }

    public startGame()
    {
		if (this.state == GameState.Started)
			return ;
		this.state = GameState.Started;
        console.log('In startGame');	
        this.gameInstance.resetRound();
		this.gameInstance.gameLoop();
    }

    public removeClient(client: AuthenticatedSocket)
    {
        client.data.lobby = null;
        client.leave(this.id);
        this.clients.delete(client.id);
		this.gameInstance.stop();
        if (this.gameInstance.isPlayer(client.id))
        {
            this.clients.forEach((user, id) => {
                this.clients.delete(id);
            })

            this.nbPlayers = 0;
            this.state = GameState.Stopped;          
            this.sendToUsers('gameStopped', "");  
        }          
    }

    public playersId(): string[] { return this.gameInstance.playersId(); }

    public sendUpdate(event: string, data: any) { this.server.to(this.id).emit(event, data); }

    public needUpdate(event: string, data: GameData) { 
		const [firstClient] = this.clients.keys()
		this.server.to(firstClient).emit(event, data); 
    }

    public sendToUsers(event: string, data: any) { this.server.to(this.id).emit(event, data); }

	public getUser(client: AuthenticatedSocket)
	{
		return this.gameInstance.getPlayer(client.id);
	}

    public isClient(clientLogin: string): boolean
    {
        return this.clients.get(clientLogin) == undefined ? false : true;
    }
}