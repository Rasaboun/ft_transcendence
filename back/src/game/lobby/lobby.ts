import { v4 } from "uuid";
import { Server } from "socket.io";
import { GameData, GameOptions, GameState, Player } from "../types/game.type";
import { GameInstance } from "../game.instance";
import { Socket } from "dgram";
import { AuthenticatedSocket } from 'src/auth/types/auth.type';
import { ConsoleLogger } from "@nestjs/common";

export class Lobby
{
    public readonly id:             string = v4();
    public          nbPlayers:      number = 0;
    public          state:          GameState = GameState.Stopped;

    public readonly gameInstance:   GameInstance;

    //public         clients:        	Map<string, AuthenticatedSocket> = new Map<string, AuthenticatedSocket>();
    public         clients:        	Map<string, string> = new Map<string, string>();

    constructor    ( private server: Server, private options: GameOptions)
    {
        console.log("options", options);
        this.gameInstance = new GameInstance(this, options.mode);
    }

    public addClient(client: AuthenticatedSocket): void
    {
        console.log("New client login", client.login);
        this.clients.set(client.login, client.roomId);
        client.join(this.id);
        client.lobby = this;
        console.log(this.id)
        
        if (this.nbPlayers < 2)
        {
            this.gameInstance.addPlayer(client.login);
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
        this.gameInstance.resetRound();
		this.gameInstance.gameLoop();
    }

    public removeClient(client: AuthenticatedSocket)
    {
        client.lobby = null;
        client.leave(this.id);
        this.clients.delete(client.login);
		this.gameInstance.stop();
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
         

    public playersId(): string[] { return this.gameInstance.playersId(); }

    public sendUpdate(event: string, data: any) { this.server.to(this.id).emit(event, data); }

    public needUpdate(event: string, data: GameData) { 
		const [firstClient] = this.clients.keys()
		this.server.to(firstClient).emit(event, data); 
    }

    public async sendToUsers(event: string, data: any)
    {
        this.server.to(this.id).emit(event, data);
    }

	public getPlayer(clientLogin: string)
	{
		return this.gameInstance.getPlayer(clientLogin);
	}

    public isClient(clientLogin: string): boolean
    {
        return this.clients.get(clientLogin) === undefined ? false : true;
    }

    public isPrivate(): boolean { return this.options.inviteMode; }
}