import { ForbiddenException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { WebSocketServer } from "@nestjs/websockets";
import { ActionOnUser, AuthenticatedSocket, ChannelClient, InviteClient, Message, SetChannelPassword } from "../types/channel.type";
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
        
        channel.addClient(client);
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
        this.channelsService.setPassword({channelName: channelName, password: "1234"}); //tmp
        //this.channelsService.setPrivateMode(channelName);
        //channel.isPrivate = true;
        return channel;
    }

    public async joinChannel(client: AuthenticatedSocket, channelName: string)
    {        
        const channel: Channel = this.channels.get(channelName);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist anymore");

        if (await this.channelsService.isBanned(channelName, client.id) == true)
            throw new ForbiddenException("You are banned from this channel");

        try
        {
            if (channel.isPrivate && !(await this.channelsService.isInvited(channelName, client.id)))
                throw new ForbiddenException("You are not invited to this channel");
            //add password as param
            this.channelsService.addClient(channelName, client.id) //change to real id
        }
        catch (error) { throw error }
        channel.addClient(client);
        console.log(client.id, channelName)
        channel.sendToUsers("joinedChannel", {clientId: client.id, channelId: channelName});
    }

    public deleteChannel(channelId: string)
    {
        const channel: Channel = this.channels.get(channelId);
        if (!channel == undefined)
            throw new NotFoundException("This channel does not exist");

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
        }
        catch (error) { throw error }

        if (caller == undefined || caller.isAdmin == false)
            throw new ForbiddenException("You are not allowed to do this");
        
        try {    
            await this.channelsService.muteClient(data);
        } catch (error) {
            throw error;
        }
    }
    
    public async banUser(clientId: string, data: ActionOnUser)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, clientId);
        }
        catch (error) { throw error }

        if (caller == undefined || caller.isAdmin == false)
            throw new ForbiddenException("You are not allowed to do this");
        
        try {    
            await this.channelsService.banClient(data);
        } catch (error) {
            throw error;
        }
    }
    
    public async inviteClient(clientId: string, data: InviteClient)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(data.channelName, clientId);
        }
        catch (error) { throw error }

        if (caller == undefined || caller.isAdmin == false)
            throw new ForbiddenException("You are not allowed to do this");
        
        // Send notification ?
        try {    
            await this.channelsService.inviteClient(data);
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
    
        if (caller == undefined || caller.isAdmin == false)
            throw new ForbiddenException("You are not allowed to do this");
        
        try {    
            await this.channelsService.setPassword(data);
            this.channels.get(data.channelName).isPasswordProtected = true;
        } catch (error) {
            throw error;
        }
    }
    
    // public async unsetChannelPassword(clientId: string, channelName: string)
    // {
    //     let caller: ChannelClient;
    //     try {
    //         caller = await this.channelsService.getClientById(channelName, clientId);
    //     }
    //     catch (error) { throw error }

    //     if (caller == undefined || caller.isAdmin == false)
    //         throw new ForbiddenException("You are not allowed to do this");
    //     try {    
    //         await this.channelsService.unsetPassword(channelName, clientId);
    //         this.channels.get(data.channelName).isPasswordProtected = false;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    public async setPrivateMode(clientId: string, channelName: string)
    {
        let caller: ChannelClient;
        try {
            caller = await this.channelsService.getClientById(channelName, clientId);
        }
        catch (error) { throw error }
    
        if (caller == undefined || caller.isAdmin == false)
            throw new ForbiddenException("You are not allowed to do this");
        
        try {    
            await this.channelsService.setPrivateMode(channelName);
            this.channels.get(channelName).isPrivate = true;
        } catch (error) {
            throw error;
        }
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
        let res:{channelId: string, clientsId: string[]}[] = [];
        this.channels.forEach((channel, id) => {
            // if (channel.getNbClients() > 0)
            // {
            //     res.push({
            //         channelId: id,
            //         clientsId: channel.clientsId(),
            //     })
            // }
            res.push({
                        channelId: id,
                        clientsId: channel.clientsId(),
                        
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