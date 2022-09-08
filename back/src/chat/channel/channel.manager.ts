import { ForbiddenException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { WebSocketServer } from "@nestjs/websockets";
import { ActionOnUser, AuthenticatedSocket, ChannelClient, Message } from "../types/channel.type";
import { Channel } from "./channel";
import { ChannelsService } from "./channel.service";

export class ChannelManager
{
	
	constructor(
        @Inject(forwardRef(() => ChannelsService))
        private channelsService: ChannelsService) {}

    @WebSocketServer()
    public server;
    private readonly channels: Map<string, Channel> = new Map<string, Channel>();

    
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
        //check if name is already taken
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
        return channel;
    }

    public joinChannel(client: AuthenticatedSocket, channelId: string)
    {        
        const channel: Channel = this.channels.get(channelId);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist anymore");
        
        if (this.channelsService.isBanned(channelId, client.id))
            throw new ForbiddenException("You are banned from this channel");

        channel.addClient(client);
        this.channelsService.addClient(channelId, client.id) //change to real id
        channel.sendToUsers("joinedChannel", client.id);
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
   
    public  sendMessage(channelId: string, msg: Message)
    {
        const channel: Channel = this.channels.get(channelId);
        
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        if (this.channelsService.isMuted(channelId, msg.sender))
            throw new ForbiddenException("You are muted on this channel");

        channel.sendMessage(msg.sender, msg.content);
        this.channelsService.addMessage(channelId, msg);
    }

    public async muteUser(clientId: string, data: ActionOnUser)
    {

        const caller: ChannelClient = await this.channelsService.getClientById(data.channelName, clientId);
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

        const caller: ChannelClient = await this.channelsService.getClientById(data.channelName, clientId);
        if (caller == undefined || caller.isAdmin == false)
            throw new ForbiddenException("You are not allowed to do this");
        
        try {    
            await this.channelsService.banClient(data);
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
            if (channel.getNbClients() > 0)
            {
                res.push({
                    channelId: id,
                    clientsId: channel.clientsId(),
                })
            }
        });
        return res;
        
    }

    //Deletes stopped channels every minutes
    @Interval(60 * 1000)
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