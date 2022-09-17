import { ForbiddenException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { WebSocketServer } from "@nestjs/websockets";
import { ActionOnUser, AddAdmin, AuthenticatedSocket, ChannelClient, ChannelInfo, ChannelModes, CreateChannel, InviteClient, JoinChannel, Message, MutedException, SetChannelPassword } from "../types/channel.type";
import { Channel } from "./channel";
import { ChannelsService } from "./channel.service";

export class ChannelManager
{
	
	constructor(
        @Inject(forwardRef(() => ChannelsService))
        private channelsService: ChannelsService)
    {
        this.getChannelsInDb();
    }

    @WebSocketServer()
    public server;
    private readonly channels: Map<string, Channel> = new Map<string, Channel>();

    private async getChannelsInDb()
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

            channel.sendToUsers("joinedChannel", {clientId: client.login, channelInfo:channel.getInfo()});
            this.sendClientInfo(client, data.name);
        
            return channel;
        }
        catch (error) { throw error }
    }

    public async joinChannel(client: AuthenticatedSocket, data: JoinChannel)
    {
        const channel: Channel = this.channels.get(data.channelName);

        if (channel == undefined)
            throw new NotFoundException("This channel does not exist anymore");

        if (await this.channelsService.isBanned(data.channelName, client.login) == true)
            throw new ForbiddenException("You are banned from this channel");

        try
        {
            if (channel.isPrivate() && !(await this.channelsService.isInvited(data.channelName, client.login)))
                throw new ForbiddenException("You are not invited to this channel");
            if (this.channelsService.isClient(channel.id, client.login))
            {
                channel.sendToUsers("joinedChannel", {clientId: client.login, channelInfo: channel.getInfo()});
                return ;
            }

            // A TESTER    
            // if (await this.channelsService.isClient(data.channelName, client.id))
            // {
            //     if (channel.isPasswordProtected && !(await this.channelsService.checkPassword(data.channelName, data.password)))
            //         throw new ForbiddenException("Wrong channel password");
            //     const messages: Message[] = await this.channelsService.getClientMessages(data.channelName, client.id);
            //     client.emit("connectedToChannel", {
            //         channelName: data.channelName,
            //         messages: messages,
            //     })
            // }

            await this.channelsService.addClient(data.channelName, client.login, data.password) //change to real id
            
            channel.addClient(client.login, client.roomId);
            client.join(channel.id);
            channel.sendToUsers("joinedChannel", {clientId: client.login, channelInfo: channel.getInfo()});
            this.sendClientInfo(client, data.channelName);
        }
        catch (error) { throw error }
    }

    public async joinChannels(client: AuthenticatedSocket)
    {
        console.log("login: ", client.login);
        for (const channelName in this.channels)
        {
            
            console.log("Channel: ", channelName);
            if ((await this.channelsService.isClient(channelName, client.login)))
            {
                client.join(channelName);
                this.channels.get(channelName).updateClient(client.login, client.roomId)
            }
        }
    }

    public async leaveChannel(clientId: string, channelName: string)
    {
        try
        {    
            const channel: Channel = this.channels.get(channelName);
            if (channel == undefined)
                throw new NotFoundException("This channel does not exist anymore");
            
            await this.channelsService.removeClient(channelName, clientId);
            channel.removeClient(clientId);
            channel.sendToUsers("leftChannel", {channelName: channel.id, clientId: clientId});
            if (channel.getNbClients() == 0)
            {
                this.channels.delete(channelName);
                await this.channelsService.deleteChannel(channelName);
                return ;
            }
            if (channel.owner != clientId)
                return ;
            let newOwnerRoomId: string = null;
            let newOwnerUsername: string = null;

            if (channel.owner == clientId)
            {
                channel.clients.forEach((roomId, id) => {
                    if (this.channelsService.isAdmin(channelName, id) && id != clientId)
                    {
                        newOwnerRoomId = roomId;
                        newOwnerUsername = id;
                    }
                })
            }
            if (newOwnerUsername == null)
            {
                channel.clients.forEach((roomId, id) => {
                    if (id != clientId)
                    {
                        newOwnerRoomId = roomId;
                        newOwnerUsername = id;
                    }
                })
            }
            channel.owner = newOwnerUsername;
            if (newOwnerRoomId)
                this.server.to(newOwnerRoomId).emit("upgradeToOwner", channel.id);
            await this.channelsService.setNewOwner(channelName, newOwnerUsername);

        } catch (error) { throw error }
    }

    public deleteChannel(channelId: string)
    {
        const channel: Channel = this.channels.get(channelId);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        channel.sendToUsers("channelDeleted", "Channel has been destroyed");
        // channel.clients.forEach((client) => {
        //     client.leave(channel.id);                    // change here
        // })
        this.channels.delete(channelId);
        this.channelsService.deleteChannel(channelId);
    }
   
    public async sendMessage(channelId: string, msg: Message)
    {
        const channel: Channel = this.channels.get(channelId);
        msg.date = new Date().toString();
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        if (await this.channelsService.isMuted(channelId, msg.sender) == true)
        { 
            const mutedTimeRemaining = (await this.channelsService.getClientById(channelId, msg.sender)).unmuteDate - new Date().getTime() / 1000;
            throw new MutedException("You are muted on this channel", mutedTimeRemaining);
        }
        this.channelsService.getClientById
        channel.sendMessage(msg.sender, msg.content);
        await this.channelsService.addMessage(channelId, msg);
    }

    public async muteUser(clientId: string, data: ActionOnUser)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, clientId);
            if (caller == undefined || caller.isAdmin == false || this.channels.get(data.channelName).owner == data.targetId)
                throw new ForbiddenException("You are not allowed to do this");
            await this.channelsService.muteClient(data);

            this.channels.get(data.channelName).sendToUsers("mutedInChannel", data.targetId);  
        } catch (error) {
            throw error;
        }
    }
    
    public async banUser(clientId: string, data: ActionOnUser)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, clientId);

            if (caller == undefined || caller.isAdmin == false || this.channels.get(data.channelName).owner == data.targetId)
                throw new ForbiddenException("You are not allowed to do this");
            await this.channelsService.banClient(data);
            this.channels.get(data.channelName).sendToUsers("bannedFromChannel", data.targetId);    
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
            channel.sendToClient(data.clientId, "addAdmin");
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
            this.setPrivateMode(clientId, data.channelName);
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
        const data: ChannelClient = await this.channelsService.getClientById(channelName, client.login)
        client.emit("clientInfo", {
            isOwner: data.isOwner,
            isAdmin: data.isAdmin,
            isMuted: await this.channelsService.isMuted(channelName, client.login),
        })
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

    //Deletes stopped channels every minutes
    //@Interval(60 * 1000)
    private channelsCleaner(): void
    {
        console.log(`Avalaible channels: ${this.channels.size}`);
        this.channels.forEach((channel, id) => {
            if (channel.getNbClients() == 0)
            {
                this.channels.delete(id);
            }
        });
        console.log(`Active channels: ${this.channels.size}`);
    }

}