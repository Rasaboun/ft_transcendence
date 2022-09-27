import { ForbiddenException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { WebSocketServer } from "@nestjs/websockets";
import { createClient } from "redis";
import { mergeScan } from "rxjs";
import { Server } from "socket.io";
import { AuthenticatedSocket } from 'src/auth/types/auth.type';
import { GameMode } from "src/game/types/game.type";
import { UsersService } from "src/users/users.service";
import { ActionOnUser, AddAdmin, ChannelClient, ChannelInfo, ChannelModes, ClientInfo, CreateChannel, InviteClient, JoinChannel, Message, MessageTypes, MutedException, SetChannelPassword, uuidRegexExp } from "../types/channel.type";
import { Channel } from "./channel";
import { ChannelsService } from "./channel.service";

export class ChannelManager
{
	
	constructor(
        @Inject(forwardRef(() => ChannelsService))
        private channelsService: ChannelsService,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,)
    {
    }

    @WebSocketServer()
    public server: Server;
    private readonly channels: Map<string, Channel> = new Map<string, Channel>();

    public async initChannels()
    {
        const channelsInDb = await this.channelsService.findAll();
        for (let i = 0; i < channelsInDb.length; i++)
        {
            const currChannel = new Channel(this.server, channelsInDb[i].name);
            
            for (let clientIndex = 0; clientIndex < channelsInDb[i].clients.length; clientIndex++)
            {
                currChannel.addClient(channelsInDb[i].clients[clientIndex].id, null);
            }
            this.channels.set(channelsInDb[i].name, currChannel)
        }
    }
    
    public initializeSocket(client: AuthenticatedSocket): void
    {
    }

    public terminateSocket(client: AuthenticatedSocket): void
    {
    }

    public async createChannel(client: AuthenticatedSocket, data: CreateChannel)
    {
        try
        {       
            if (this.channels.get(data.name) != undefined)
                throw new ForbiddenException("This channel name is already taken");
            if (uuidRegexExp.test(data.name))
                throw new ForbiddenException("Invalid channel name");
            let channel = new Channel(this.server, data.name);
            
            channel.owner = client.login;
            channel.mode = data.mode;
            channel.addClient(client.login, client.roomId);

            if (data.mode != ChannelModes.Password)
                data.password = "";

            this.channels.set(channel.id, channel);
            await this.channelsService.createChannel( //change to just the name
                {
                    name: data.name,
                    mode: data.mode,
                    password: data.password,
                    ownerId: client.login, //change to real id
                });
            await this.channelsService.addClient(channel.id, client.login, data.password);//change to real id
            await this.channelsService.addAdmin(channel.id, client.login);//change to real id

            client.join(channel.id);
            channel.sendToUsers("joinedChannel", {clientId: client.login, channelInfo: channel.getInfo(await this.getChannelClients(channel.id)), });
        
            return channel;
        }
        catch (error) { throw error }
    }

    public async joinChannel(client: AuthenticatedSocket, data: JoinChannel)
    {
        try
        {
            const channel: Channel = this.channels.get(data.channelName);
            const mutedList = await (await this.channelsService.findOneById(data.channelName)).mutedList;

            if (channel == undefined)
                throw new NotFoundException("This channel does not exist anymore");

            if (await this.channelsService.isBanned(data.channelName, client.login) == true)
            {
                const user = await this.channelsService.getClientById(data.channelName, client.login);
                const timeBanned = user.unbanDate - (new Date().getTime() / 1000);
                console.log(`You are banned from this channel for ${Math.trunc(timeBanned)} seconds`);
                return ;

            }
            if ((await this.channelsService.isClient(channel.id, client.login)))
            {
                client.join(channel.id);
                client.emit("joinedChannel", {clientId: client.login, channelInfo: channel.getInfo(await this.getChannelClients(channel.id))});
                //channel.sendToClient(client.login, "joinedChannel", {clientId: client.login, channelInfo: channel.getInfo(await this.getChannelClients(channel.id))});
                
                return ;
            }
            if (channel.isPrivate() && !(await this.channelsService.isInvited(data.channelName, client.login)))
                throw new ForbiddenException("You are not invited to this channel");

            await this.channelsService.addClient(data.channelName, client.login, data.password) //change to real id

            const user = await this.userService.findOneByIntraLogin(client.login);
            await this.sendInfoMessage(client, channel.id, `${user.username} joined the channel`);

            channel.addClient(client.login, client.roomId);
            client.join(channel.id);
            client.emit("joinedChannel", {clientId: client.login, channelInfo: channel.getInfo(await this.getChannelClients(channel.id))});
            channel.sendToUsers("joinedChannel", {clientId: client.login, channelInfo: channel.getInfo(await this.getChannelClients(channel.id))}, client.roomId);
        }
        catch (error) { throw error }
    }

    public async joinChannels(client: AuthenticatedSocket)
    {
        for (const [channelName, channel] of this.channels)
        {
            if ((await this.channelsService.isClient(channelName, client.login)))
            {
                client.join(channelName);
                this.channels.get(channelName).updateClient(client.login, client.roomId)
            }
        }
    }

    public async leaveChannel(client: AuthenticatedSocket, channelName: string)
    {
        try
        {    
            const channel: Channel = this.channels.get(channelName);
            if (channel == undefined)
                throw new NotFoundException("This channel does not exist anymore");
            
            await this.channelsService.removeClient(channelName, client.login);
            channel.removeClient(client.login);

            const user = await this.userService.findOneByIntraLogin(client.login);
            await this.sendInfoMessage(client, channel.id, `${user.username} left the channel`);

            channel.sendToUsers("leftChannel", channel.getInfo(await this.getChannelClients(channel.id)));
            if (channel.getNbClients() == 0)
            {
                await this.deleteChannel(channelName);
                //this.channels.delete(channelName);
                //await this.channelsService.deleteChannel(channelName);
                return ;
            }
            if (channel.owner != client.login)
                return ;
            let newOwnerUsername: string = null;

            
            channel.clients.forEach((roomId, id) => {
                if (this.channelsService.isAdmin(channelName, id) && id != client.login)
                {
                    newOwnerUsername = id;
                }
            })
            if (newOwnerUsername == null)
            {
                channel.clients.forEach((roomId, id) => {
                    if (id != client.login)
                    {
                        newOwnerUsername = id;
                    }
                })
            }
            channel.owner = newOwnerUsername
            //add new owner in admin
            await this.channelsService.setNewOwner(channelName, newOwnerUsername);
            channel.sendToUsers("newOwner", {target: newOwnerUsername, channelInfo: channel.getInfo(await this.getChannelClients(channel.id)) });
        

        } catch (error) { throw error }
    }

    public async deleteChannel(channelId: string)
    {
        const channel: Channel = this.channels.get(channelId);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        await channel.sendToUsers("channelDeleted", "Channel has been destroyed");
  
        this.channels.delete(channelId);
        this.channelsService.deleteChannel(channelId);

        const clientsSockets = await this.server.in(channelId).fetchSockets();
        console.log(`Channel got deleted with ${clientsSockets.length} clients`);
        clientsSockets.forEach((socket) => {
            socket.leave(channelId);
        })

        this.server.emit('activeChannels', this.getActiveChannels());
    }
   
    public async sendMessage(channelId: string, client: AuthenticatedSocket, msg: string)
    {
        try
        {
            const channel: Channel = this.channels.get(channelId);
            
            if (channel == undefined)
                throw new NotFoundException("This channel does not exist");
            if (await this.channelsService.isMuted(channelId, client.login) == true)
            { 
                const mutedTimeRemaining = (await this.channelsService.getClientById(channelId, client.login)).unmuteDate - new Date().getTime() / 1000;
                throw new MutedException("You are muted on this channel", mutedTimeRemaining);
            }
            const user = await this.userService.findOneByIntraLogin(client.login);

            let message: Message = {
                sender: {
                    login: user.intraLogin,
                    username: user.username,
                },
                channelName: channelId,
                content: msg,
                date: new Date().toString(),
                type: MessageTypes.Message,
            };

            channel.sendMessage(message);
            await this.channelsService.addMessage(channelId, message);
        }
        catch (error) { throw error; }
    }

    public async sendInfoMessage(client: AuthenticatedSocket, channelId: string, content: string)
    {
        try
        {
            const message: Message = {
                sender: {
                    login: client.login,
                    username: client.login,
                },
                channelName: channelId,
                date: new Date().toString(),
                content: content,
                type: MessageTypes.Info,
            }
            this.channels.get(channelId).sendMessage(message);
            await this.channelsService.addMessage(channelId, message);
        }
        catch (error) { throw error; }
    }

    public async createAndSaveInfoMessage(client: AuthenticatedSocket, channelId: string, content: string)
    {
        try
        {
            const message: Message = {
                sender: {
                    login: client.login,
                    username: client.login,
                },
                channelName: channelId,
                date: new Date().toString(),
                content: content,
                type: MessageTypes.Info,
            }
            await this.channelsService.addMessage(channelId, message);
        }
        catch (error) { throw error; }

    }

    public async muteUser(client: AuthenticatedSocket, data: ActionOnUser)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, client.login);
            if (caller == undefined || caller.isAdmin == false || this.channels.get(data.channelName).owner == data.targetId)
                throw new ForbiddenException("You are not allowed to do this");
            await this.channelsService.muteClient(data);

            this.createAndSaveInfoMessage(client, data.channelName, `${data.targetId} has been muted for ${data.duration} secs`);
            this.channels.get(data.channelName).sendToUsers("mutedInChannel", data);  
        } catch (error) {
            throw error;
        }
    }
    
    public async banUser(client: AuthenticatedSocket, data: ActionOnUser)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, client.login);

            if (caller == undefined || caller.isAdmin == false || this.channels.get(data.channelName).owner == data.targetId)
                throw new ForbiddenException("You are not allowed to do this");
            await this.channelsService.banClient(data);

            this.createAndSaveInfoMessage(client, data.channelName, `${data.targetId} has been banned for ${data.duration} secs`);
            this.channels.get(data.channelName).sendToUsers("bannedFromChannel", data);    
        } catch (error) {
            throw error;
        }
    }
    
    public async addAdmin(clientId: string, data: AddAdmin)
    {
        let channel = this.channels.get(data.channelName);

        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        try {
            if (!this.channelsService.isAdmin(data.channelName, clientId) || data.clientId == channel.owner)
                throw new ForbiddenException("You are not allowed to do this");
            if (await this.channelsService.isAdmin(data.channelName, data.clientId))
            {
                channel.sendToClient(clientId, "isAlreadyAdmin");
                return ;
            }
            await this.channelsService.addAdmin(data.channelName, data.clientId);
            channel.sendToUsers("addAdmin", {target: data.clientId, channelInfo: channel.getInfo(await this.getChannelClients(channel.id)) });
        }
        catch (error) {
            throw error;
        }
    }


    public async inviteClient(clientId: string, data: InviteClient)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, clientId);
            if (caller == undefined || caller.isAdmin == false)
                throw new ForbiddenException("You are not allowed to do this");
            let target = await this.userService.findOneByUsername(data.clientId);
            if (!target)
                throw new NotFoundException("This user does not exist");
            data.clientId = target.intraLogin;
            // Send notification ?
            await this.channelsService.inviteClient(data);
            //console.log(this.channels.get(data.channelName).getClientSocket(data.clientId))
            //need session this.channels.get(data.channelName).getClientSocket(data.clientId).emit("InvitedToChannel", data.channelName)
        } catch (error) {
            throw error;
        }

    }

    public async setChannelPassword(clientId: string, data: SetChannelPassword)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, clientId);
        }
        catch (error) { throw error }
    
        if (caller == undefined || caller.isOwner == false)
            throw new ForbiddenException("You are not allowed to do this");
        
        try {    
            await this.channelsService.setPassword(data);
            this.channels.get(data.channelName).changeMode(ChannelModes.Password);
        } catch (error) {
            throw error;
        }
    }
    
    public async unsetChannelPassword(clientId: string, channelName: string)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(channelName, clientId);
       
            if (caller == undefined || caller.isOwner == false)
                throw new ForbiddenException("You are not allowed to do this");  
            
            await this.channelsService.unsetPassword(channelName);
            this.channels.get(channelName).changeMode(ChannelModes.Public);
        }
        catch (error) { throw error }
    }

    public async setPrivateMode(clientId: string, channelName: string)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(channelName, clientId);
    
            if (caller == undefined || caller.isOwner == false)
                throw new ForbiddenException("You are not allowed to do this");
            
            await this.channelsService.setPrivateMode(channelName);
            this.channels.get(channelName).changeMode(ChannelModes.Private);
            this.server.emit('activeChannels', this.getActiveChannels());
        }
        catch (error) {
            throw error;
        }
    }

    public async unsetPrivateMode(clientId: string, channelName: string)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(channelName, clientId);
       
            if (caller == undefined || caller.isOwner == false)
                throw new ForbiddenException("You are not allowed to do this");  
            
            await this.channelsService.unsetPassword(channelName);
            this.channels.get(channelName).changeMode(ChannelModes.Public);
        }
        catch (error) { throw error }
    }

    public async sendClientInfo(client: AuthenticatedSocket, channelName: string)
    {
        try
        {
            const data: ChannelClient = await this.channelsService.getClientById(channelName, client.login)
            const messages: Message[] = await this.channelsService.getClientMessages(channelName, client.login);
            client.emit("clientInfo", {
                isOwner: data.isOwner,
                isAdmin: data.isAdmin,
                isMuted: await this.channelsService.isMuted(channelName, client.login),
                unmuteDate: data.unmuteDate,
                messages: messages,
            })
        } catch (error) { throw error }
        
    }

    public async sendChannelInfo(client: AuthenticatedSocket, channelName: string)
    {
        try
        {
            const channel = this.channels.get(channelName);
            if (channel == undefined)
                throw new NotFoundException("This channel does not exist");
            client.emit('channelInfo', channel.getInfo(await this.getChannelClients(channel.id)))
        } catch (error) { throw error }
        
    }

    public async sendInvitation(client: AuthenticatedSocket, data:{channelName: string, mode: GameMode})
    {
        try
        {
            const channel = this.channels.get(data.channelName);
            if (channel == undefined)
                throw new NotFoundException("This channel does not exist");
            const user = await this.userService.findOneByIntraLogin(client.login);
            
            let msg = `invites you to join a game. Mode: `;
            switch (data.mode) {
                case GameMode.Mini:
                    msg += "Mini.";
                    break;
                case GameMode.Speed:
                    msg += "Speed.";
                    break;
                default:
                    msg += "Normal.";
                    break;
            }

            let message: Message = {
                sender: {
                    login: user.intraLogin,
                    username: user.username,
                },
                channelName: data.channelName,
                content: msg,
                date: new Date().toString(),
                type: MessageTypes.Invitation,
            };

            channel.sendMessage(message);
            await this.channelsService.addMessage(data.channelName, message);
        } catch (error) { throw error }

    }

    public async getChannelClients(channelName: string)
    {
        let clients: ClientInfo[] = [];

        const channel = this.channels.get(channelName); 
        if (!channel)
            throw new NotFoundException("This channel does not exist anymore");

        for (const [clientLogin, roomId] of channel.clients)
        {
            const channelInfo: ChannelClient = await this.channelsService.getClientById(channelName, clientLogin);
            const userInfo = await this.userService.findOneByIntraLogin(clientLogin);
            clients.push({
                login: clientLogin,
                username: userInfo.username,
                isOwner: channelInfo.isOwner,
                isAdmin: channelInfo.isAdmin,
                isMuted: await this.channelsService.isMuted(channelName, clientLogin),
            })
        }
        return clients;
    }

    public getChannel(channelId: string)
    {
        const channel: Channel = this.channels.get(channelId);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist anymore");
        return channel;
    }


    public getActiveChannels()
    {
        let res: ChannelInfo[] = [];

        this.channels.forEach((channel, id) => {
            res.push({
                        channelId: id,
                        nbClients: channel.clients.size,
                        mode: channel.mode,
                        owner: channel.owner,
                        
                    })
        });
        return res;
        
    }
}