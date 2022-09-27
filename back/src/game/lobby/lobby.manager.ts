import { forwardRef, Inject, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { AuthenticatedSocket } from 'src/auth/types/auth.type';
import { GameInstance } from "../game.instance";
import { GameMode, GameOptions, GameState, Player } from "../types/game.type";
import { Lobby } from "./lobby";

type availableLobbiesT = [{
    lobbyId: string;
    playersId: string[];
}]

export class LobbyManager
{
    @WebSocketServer()
    public server;

    private readonly lobbies: Map<string, Lobby> = new Map<string, Lobby>();
    private readonly avalaibleLobbies: Lobby[] = [];

    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
    ) { }

    public initializeSocket(client: AuthenticatedSocket): void
    {
    }

    public terminateSocket(client: AuthenticatedSocket): void
    {
       
        for (let i = 0; i < this.avalaibleLobbies.length; i++)
        {
            if (this.avalaibleLobbies[i].isClient(client.login))
            {
                this.avalaibleLobbies.splice(i, 1);
                client.leave(this.avalaibleLobbies[i]?.id);
            }
        }
        client.leave(client.roomId);
    }

    public createLobby(options: GameOptions): Lobby
    {
        let lobby = new Lobby(this.server, options, this);

        this.avalaibleLobbies.push(lobby);

        return lobby;
    }

    public destroyLobby(lobbyId: string)
    {
        this.lobbies.delete(lobbyId);
    }

    public joinQueue(client: AuthenticatedSocket, mode:GameMode)
    {
        let lobby: Lobby = null;
   
        for (let i = 0; i < this.avalaibleLobbies.length; i++)
        {
            const currLobby = this.avalaibleLobbies[i];
            if (currLobby.isClient(client.login) === false && !currLobby.isPrivate() && currLobby.getMode() == mode) 
            {
                lobby = this.avalaibleLobbies.splice(i, 1).at(0);
                client.lobbyId = lobby.id;
                break ;
            }
        }
        if (lobby === null)
        {	
            const options: GameOptions = {
                mode: mode,
                inviteMode: false,
            }
            lobby = this.createLobby(options);
            this.avalaibleLobbies.push(lobby);
        }
        this.lobbies.set(lobby.id, lobby);
        lobby.addClient(client);
        this.authService.updateLobby(client.login, lobby.id);
    }

    public leaveQueue(client: AuthenticatedSocket)
    {
        for (let i = 0; i < this.avalaibleLobbies.length; i++)
        {
            if (this.avalaibleLobbies[i].isClient(client.login))
            {
                this.avalaibleLobbies.splice(i, 1);
                this.destroyLobby(this.avalaibleLobbies[i]?.id);
                client.lobby = null;
                this.authService.updateLobby(client.login, null);
            }
        }
    }

    public joinLobby(lobbyId: string, client: AuthenticatedSocket)
    {
        console.log(`Spectacte lobby ${lobbyId}`);
        
        const lobby: Lobby = this.lobbies.get(lobbyId);
        if (!lobby)
           throw new NotFoundException("This lobby does not exist anymore");
        lobby.addClient(client);
        this.authService.updateLobby(client.login, lobby.id);
    }

    public joinInvitation(client: AuthenticatedSocket, senderLogin: string): boolean
    {
        let lobby: Lobby = null;
        console.log("joining invitation from", senderLogin);
        for (let i = 0; i < this.avalaibleLobbies.length; i++)
        {
            const currLobby = this.avalaibleLobbies[i];
            if (currLobby.isClient(senderLogin) === true && currLobby.isPrivate()) 
            {
                lobby = this.avalaibleLobbies.splice(i, 1).at(0);
                client.lobbyId = lobby.id;
                if (lobby.nbPlayers == 1)
                    this.lobbies.set(lobby.id, lobby);
                this.authService.updateLobby(client.login, lobby.id);
                lobby.addClient(client);
                return true;
            }
        }
        return false;
    }

    public async joinLobbies(client: AuthenticatedSocket)
    {
        if (client.lobbyId)
        {
            client.lobby = this.lobbies.get(client.lobbyId);
        }
        for (const [lobbyId, lobby] of this.lobbies)
        {
            if (lobby.isClient(client.login))
            {
                client.join(lobbyId);
            }
        }
    }

    public getLobby(lobbyId: string)
    {
        if (!lobbyId)
            return null;
        return this.lobbies.get(lobbyId);
    }

    public getActiveLobbies()
    {
        let res:{lobbyId: string, playersId: string[]}[] = [];
        this.lobbies.forEach((lobby, id) => {
            if (lobby.state == GameState.Started && lobby.nbPlayers == 2)
            {
                res.push({
                    lobbyId: id,
                    playersId: lobby.playersId(),
                })
            }
        });
        return res;
        
    }

}