import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AuthenticatedSocket } from 'src/sessions/sessions.type';
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

    constructor() { }

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
        let lobby = new Lobby(this.server, options);

        this.lobbies.set(lobby.id, lobby);

        return lobby;
    }

    public joinQueue(client: AuthenticatedSocket)
    {
        let lobby: Lobby = null;

   
        for (let i = 0; i < this.avalaibleLobbies.length; i++)
        {
            if (this.avalaibleLobbies[i].isClient(client.login) === false && !this.avalaibleLobbies[i].isPrivate())
            {
                lobby = this.avalaibleLobbies.splice(i, 1).at(0);
            }
        }
        if (lobby === null)
        {	
            const options: GameOptions = {
                mode: GameMode.Speed,
                inviteMode: false,
            }
            lobby = this.createLobby(options);
            this.avalaibleLobbies.push(lobby);
        }
        console.log("Client login", client.login)
        lobby.addClient(client);
    }

    public joinLobby(lobbyId: string, client: AuthenticatedSocket)
    {
        console.log(`Spectacte lobby ${lobbyId}`);
        
        const lobby: Lobby = this.lobbies.get(lobbyId);
        if (lobby?.addClient(client) == undefined)
            throw new NotFoundException("This lobby does not exist anymore");
        else
            console.log('Spectacte success');
    }

    public async joinLobbies(client: AuthenticatedSocket)
    {
        for (const [lobbyId, lobby] of this.lobbies)
        {
            if (lobby.isClient(client.login))
            {
                client.join(lobbyId);
            }
        }
    }

    public async joinInvitation(client: AuthenticatedSocket, playerLogin: string)
    { 
        for (let i = 0; i < this.avalaibleLobbies.length; i++)
        {
            if (this.avalaibleLobbies[i].isClient(client.login) === false && !this.avalaibleLobbies[i].isPrivate())
            {
                const lobby = this.avalaibleLobbies.splice(i, 1).at(0);
                lobby.addClient(client);
                return ;
            }
        }
        throw new NotFoundException("The invitation has expired");

    }

    /*
    * Retourne l'id de tous les lobbies en game et l'id des 2 joueurs
    * Va servir pour afficher toutes les parties en cours et les regarder
    * Gerer le cas ou il n'y a pas de parties en cours
    */ 

    public getActiveLobbies()
    {
        let res:{lobbyId: string, playersId: string[]}[] = [];
        this.lobbies.forEach((lobby, id) => {
            if (lobby.state == GameState.Started && lobby.nbPlayers == 2) //Send lobbies with afk ?
            {
                res.push({
                    lobbyId: id,
                    playersId: lobby.playersId(),
                })
            }
        });
        return res;
        
    }

    //Deletes stopped lobbies every 5 minutes
    @Interval(60 * 1000)
    private lobbiesCleaner(): void
    {
        for (let i = 0; i < this.avalaibleLobbies.length; i++) {
            if (this.avalaibleLobbies[i].nbPlayers == 0) {
                this.avalaibleLobbies.splice(i, 1);
            }
            
        }
        console.log(`Avalaible lobbies: ${this.avalaibleLobbies.length}`);
        this.lobbies.forEach((lobby, id) => {
			console.log(lobby.nbPlayers);
            if (lobby.state == GameState.Stopped && lobby.nbPlayers == 0)
            {
                this.lobbies.delete(id);
            }
        });
        console.log(`Active lobbies: ${this.lobbies.size}`);
    }

}