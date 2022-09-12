import { ForbiddenException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { WebSocketServer } from "@nestjs/websockets";
import { ActionOnUser, AddAdmin, AuthenticatedSocket, ChannelClient, InviteClient, JoinChannel, Message, SetChannelPassword } from "../types/channel.type";
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
            
            // for (let clientIndex = 0; clientIndex < channelsInDb[i].clients.length; clientIndex++)
            // {
            //     currChannel.addClient(channelsInDb[i].clients[clientIndex].id);
            // }
            this.channels.set(channelsInDb[i].name, currChannel)
        }
    }
    
    public initializeSocket(client: AuthenticatedSocket): void
    {
        client.data.channel = null;
    }

    public terminateSocket(client: AuthenticatedSocket): void
    {
        client.data.channel?.removeClient(client);
    }

    public async createChannel(client: AuthenticatedSocket, channelName: string)
    {
        if (this.channels.get(channelName) != undefined)
            throw new ForbiddenException("This channel name is already taken");
        
        let channel = new Channel(this.server, channelName);
        
        channel.owner = client.id;
        channel.addClient(client);
        channel.isPasswordProtected = true;
        this.channels.set(channel.id, channel);
        await this.channelsService.createChannel( //change to just the name
            {
                name: channelName,
                isPrivate: false,
                password: "",
                ownerId: client.id, //change to real id
            });
        await this.channelsService.addClient(channel.id, client.id);//change to real id
        await this.channelsService.addAdmin(channel.id, client.id);//change to real id
        await this.channelsService.setPassword({channelName, password:"1234"})
        this.sendClientInfo(client, channelName);
        return channel;
    }

    public async joinChannel(client: AuthenticatedSocket, data: JoinChannel)
    {
        console.log("ffdsfsdf", data.password)
        const channel: Channel = this.channels.get(data.channelName);
        console.log("ffdsfsdf", data.channelName)

        if (channel == undefined)
            throw new NotFoundException("This channel does not exist anymore");

        if (await this.channelsService.isBanned(data.channelName, client.id) == true)
            throw new ForbiddenException("You are banned from this channel");

        try
        {
            if (channel.isPrivate && !(await this.channelsService.isInvited(data.channelName, client.id)))
                throw new ForbiddenException("You are not invited to this channel");
            //add password as param
            this.channelsService.addClient(data.channelName, client.id, data.password) //change to real id

            channel.addClient(client);
            console.log(client.id, data.channelName)
            channel.sendToUsers("joinedChannel", {clientId: client.id, channelId: data.channelName});
            this.sendClientInfo(client, data.channelName);
        }
        catch (error) { throw error }
    }

    // public async leaveChannel(client: AuthenticatedSocket, channelName: string)
    // {        
    //     const channel: Channel = this.channels.get(channelName);
    //     if (channel == undefined)
    //         throw new NotFoundException("This channel does not exist anymore");
    //     try {
    //         await this.channelsService.removeClient(channelName, client.id);

    //     } catch (error) { throw error }
    // }

    public deleteChannel(channelId: string)
    {
        const channel: Channel = this.channels.get(channelId);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        channel.sendToUsers("channelDeleted", "Channel has been destroyed");
        channel.clients.forEach((client) => {
            client.leave(channel.id);
        })
        this.channels.delete(channelId);
        this.channelsService.deleteChannel(channelId);
    }
   
    public async sendMessage(channelId: string, msg: Message)
    {
        const channel: Channel = this.channels.get(channelId);
        
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        if (await this.channelsService.isMuted(channelId, msg.sender) == true)
            throw new ForbiddenException("You are muted on this channel");

        channel.sendMessage(msg.sender, msg.content);
        this.channelsService.addMessage(channelId, msg);
    }

    public async muteUser(clientId: string, data: ActionOnUser)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, clientId);
            if (caller == undefined || caller.isAdmin == false)
                throw new ForbiddenException("You are not allowed to do this");
            
            await this.channelsService.muteClient(data);
            this.channels.get(data.channelName).getClientSocket(data.targetId).emit("mutedInChannel");  
        } catch (error) {
            throw error;
        }
    }
    
    public async banUser(clientId: string, data: ActionOnUser)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, clientId);

            if (caller == undefined || caller.isAdmin == false)
                throw new ForbiddenException("You are not allowed to do this");
            await this.channelsService.banClient(data);
            this.channels.get(data.channelName).getClientSocket(data.targetId).emit("bannedFromChannel");    
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
            if (this.channelsService.isAdmin(data.channelName, data.clientId))
            {
                channel.getClientSocket(clientId).emit("isAlreadyAdmin");
                return ;
            }
            await this.channelsService.addAdmin(data.channelName, data.clientId);
            channel.getClientSocket(data.clientId).emit("addAdmin");
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
            this.channels.get(data.channelName).isPasswordProtected = true;
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
            this.channels.get(channelName).isPasswordProtected = false;
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
            this.channels.get(channelName).isPrivate = true;
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
            this.channels.get(channelName).isPrivate = false;
        }
        catch (error) { throw error }
    }

    public async sendClientInfo(client: AuthenticatedSocket, channelName: string)
    {
        const data: ChannelClient = await this.channelsService.getClientById(channelName, client.id)
        console.log(data);
        client.emit("clientInfo", {
            isOwner: data.isOwner,
            isAdmin: data.isAdmin,
            isMuted: await this.channelsService.isMuted(channelName, client.id),
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
        let res: {
            channelId: string,
            nbClients: number,
            isPrivate: boolean,
            isPasswordProtected: boolean,
            owner: string,
        }[] = [];
        this.channels.forEach((channel, id) => {
            res.push({
                        channelId: id,
                        nbClients: channel.clients.size,
                        isPrivate: channel.isPrivate,
                        isPasswordProtected: channel.isPasswordProtected,
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