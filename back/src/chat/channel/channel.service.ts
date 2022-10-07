import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "src/typeorm";
import { ActionOnUser, ChannelClient, ChannelModes, CreateChannel, InviteClient, Message, SetChannelPassword } from "../types/channel.type";
import * as bcrypt from 'bcrypt';
@Injectable()
export class ChannelsService {
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>
    
    private readonly saltRounds: number = 10;

    findAll() {
        return this.channelRepository.find();
    }

    findOneById(name: string){
        return this.channelRepository.findOneBy({ name })
    }

    async addClient(channelName: string, clientId: string, password?: string) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");

        if (channel.mode == ChannelModes.Password)
        {
            if (!(await this.checkPassword(channelName, password)))
                throw new ForbiddenException("Wrong channel password");
        }

        const newClient = new ChannelClient(clientId);
        
        const index = this.getClientIndex(channel.mutedList, clientId);
        if (index != -1)
        {
            newClient.unmuteDate = channel.mutedList[index].unmuteDate;
            newClient.isMuted = true;
        }

        if (channel.ownerId == clientId)
            newClient.isOwner = true;
        channel.clients.push(newClient);
        await this.channelRepository.update(channel.id, channel);
    }

    async removeClient(channelName: string, clientId: string) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");
        const userIndex = this.getClientIndex(channel.clients, clientId);
        if (userIndex == null)
            throw new NotFoundException(`Client ${clientId} is not member of channel ${channelName}`);
        
        channel.clients.splice(userIndex , 1);
        await this.channelRepository.update(channel.id, channel);
    }

    public async createChannel(data: CreateChannel) {
        if (data.mode == ChannelModes.Password)
            data.password = bcrypt.hashSync(data.password, this.saltRounds);
        const   newChannel = this.channelRepository.create(data);
    
        await   this.channelRepository.save(newChannel);
    }

    async deleteChannel(channelName: string) {
        const channel: Channel = await this.findOneById(channelName);
        
        if (!channel)
            throw new NotFoundException("This channel does not exist anymore");
        
        await this.channelRepository.delete(channel.id);
    }

    async addMessage(channelName: string, message: Message) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");

        channel.messages.push(message);
        await this.channelRepository.update(channel.id, channel);
    }

    async addAdmin(channelName: string, clientId: string) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");
        
        const clientIndex = this.getClientIndex(channel.clients, clientId);

        if (clientIndex == -1)
                throw new NotFoundException("This user is not member of the channel");

        channel.clients[clientIndex].isAdmin = true;
        await this.channelRepository.update(channel.id, channel);
        
    }

    async setNewOwner(channelName: string, newOwnerId: string)
    {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");
        const clientIndex = this.getClientIndex(channel.clients, newOwnerId);

        if (clientIndex == -1)
                throw new NotFoundException("This user is not member of the channel");

        channel.clients[clientIndex].isAdmin = true;
        channel.clients[clientIndex].isOwner = true;
        channel.ownerId = newOwnerId;
        await this.channelRepository.update(channel.id, channel);
    }

    async muteClient(data: ActionOnUser) {
        const channel: Channel = await this.findOneById(data.channelName);
         
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        const client = channel.clients[this.getClientIndex(channel.clients, data.targetId)]
        if (client == undefined)
                throw new NotFoundException("This user is not member of the channel");
        client.isMuted = true;
        client.unmuteDate = (new Date().getTime()) + (data.duration * 1000);
        channel.mutedList.push(client);
        await this.channelRepository.update(channel.id, channel);
        
    }

    async unmuteClient(channelName: string, clientId: string)
    {
        const channel: Channel = await this.findOneById(channelName);    
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        const clientIndex = this.getClientIndex(channel.clients, clientId)
        if (clientIndex == -1)
                throw new NotFoundException("This user is not member of the channel");
        
        channel.clients[clientIndex].isMuted = false;
        channel.clients[clientIndex].unmuteDate = 0;
        channel.mutedList.splice(this.getClientIndex(channel.mutedList, clientId), 1);
        await this.channelRepository.update(channel.id, channel);
    }

    async isMuted(channelName: string, clientId: string): Promise<boolean>
    {
        const channel: Channel = await this.findOneById(channelName);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        const client = channel.clients[this.getClientIndex(channel.clients, clientId)]
        if (client == undefined)
                throw new NotFoundException("This user is not member of the channel");
        const clientInMuted = channel.mutedList[this.getClientIndex(channel.mutedList, client.id)];
        if (clientInMuted)
        {
            client.isMuted = true,
            client.unmuteDate = clientInMuted.unmuteDate;
        }
        if (client.isMuted && new Date().getTime() >= client.unmuteDate)
        {
            await this.unmuteClient(channelName, client.id)
            return false;
        }
        return client.isMuted;
    }

    async isAdmin(channelName: string, clientId: string)
    {
        const channel: Channel = await this.findOneById(channelName);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        const client = channel.clients[this.getClientIndex(channel.clients, clientId)]
        if (client == undefined)
                throw new NotFoundException("This user is not member of the channel");
        return client.isAdmin;

    }

    async banClient(data: ActionOnUser) {
        const channel: Channel = await this.findOneById(data.channelName);  
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        const client = channel.clients[this.getClientIndex(channel.clients, data.targetId)]
        if (client == undefined)
                throw new NotFoundException("This user is not member of the channel");
        
        client.isBanned = true;
        client.unbanDate = (new Date().getTime()) + data.duration * 1000;
        await this.channelRepository.update(channel.id, channel);        
    }

    async unbanClient(channelName: string, clientId: string)
    {
        const channel: Channel = await this.findOneById(channelName);    
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        const clientIndex = this.getClientIndex(channel.clients, clientId)
        if (clientIndex == -1)
                throw new NotFoundException("This user is not member of the channel");
        
        channel.clients[clientIndex].isBanned = false;
        channel.clients[clientIndex].unbanDate = 0;
    }

    async setPassword(data: SetChannelPassword)
    {
        const channel: Channel = await this.findOneById(data.channelName);  
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        channel.mode = ChannelModes.Password;   
        channel.password = bcrypt.hashSync(data.password, this.saltRounds);
        await this.channelRepository.update(channel.id, channel);
    }

    async unsetPassword(channelName: string)
    {
        const channel: Channel = await this.findOneById(channelName);  
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        channel.mode = ChannelModes.Public;     
        await this.channelRepository.update(channel.id, channel);
    }

    async setPrivateMode(channelName: string)
    {
        const channel: Channel = await this.findOneById(channelName);  
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        channel.mode = ChannelModes.Private;    
        await this.channelRepository.update(channel.id, channel);
    }

    async unsetPrivateMode(channelName: string)
    {
        const channel: Channel = await this.findOneById(channelName);  
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        channel.mode = ChannelModes.Public;   
        channel.inviteList = [];   
        await this.channelRepository.update(channel.id, channel);
    }

    async inviteClient(data: InviteClient)
    {
        const channel: Channel = await this.findOneById(data.channelName);  
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        
        channel.inviteList.push(data.clientId); // Get user with id and throw error if does not exist
        await this.channelRepository.update(channel.id, channel);
    }

    async checkPassword(channelName: string, password: string): Promise<boolean>
    {
        const channel: Channel = await this.findOneById(channelName);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");
        return bcrypt.compareSync(password, channel.password);

    }

    async isBanned(channelName: string, clientId: string): Promise<boolean>
    {
        const channel: Channel = await this.findOneById(channelName);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        const client = channel.clients[this.getClientIndex(channel.clients, clientId)]
        if (client == undefined)
                return false;

        if (client.isBanned && new Date().getTime() > client.unbanDate)
        {
            this.unbanClient(channelName, client.id)
            return false;
        }
        return client.isBanned;
    }

    async isClient(channelName: string, clientId: string)
    {
        const channel: Channel = await this.findOneById(channelName);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        const index = this.getClientIndex(channel.clients, clientId);
        return index == -1 ? false : true;
    }

    async isInvited(channelName: string, clientId: string): Promise<boolean>
    {
        const channel: Channel = await this.findOneById(channelName);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        const index = channel.inviteList.indexOf(clientId);
        return index == -1 ? false : true;
    }

    async getMessages(channelName: string) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");

        return channel.messages;
    }

    async getClientMessages(channelName: string, clientId: string): Promise<Message[]>
    {
        const channel: Channel = await this.findOneById(channelName);
        if (channel == undefined)
            throw new NotFoundException("This channel does not exist");

        const index = this.getClientIndex(channel.clients, clientId);
        if (index == -1)
            throw new NotFoundException("User is not in this channel");
        
        const joinedDate = new Date(channel.clients[index].joinedDate);
        let firstMessage = 0;
        while (firstMessage < channel.messages.length && joinedDate > new Date(channel.messages[firstMessage].date))
            firstMessage++;
        return channel.messages.slice(firstMessage);

    }

    async getClientById(channelName: string, clientId: string) {
        const channel: Channel = await this.findOneById(channelName);
        let res: ChannelClient = null;

        if (!channel)
            throw new NotFoundException("Channel not found");
        channel.clients.forEach((client) => {
            if (client.id == clientId)
            {
                res = client;
                return ;
            }
        })

        return res;
    }

    private getClientIndex(clients: ChannelClient[], id: string) {

        for(let i = 0; i < clients.length; i++)
        {
            if (clients[i].id == id) {
                return i;
            }
        }
        return -1;
    }
}