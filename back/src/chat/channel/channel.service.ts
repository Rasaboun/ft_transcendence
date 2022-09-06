import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "../../typeorm/Chat";
import { CreateChannelDto } from "../dto/channel.dto";
import { ChannelClient, Message } from "../types/channel.type";

export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>
    ){
        console.log("const services")
    }

    findAll() {
        return this.channelRepository.find();
    }

    findOneById(name: string){
        console.log("In find", name);
        return this.channelRepository.findOneBy({ name })
    }

    async addClient(channelName: string, clientId: number) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");

        // Check password

        const newClient: ChannelClient = {
            id: clientId,
            isAdmin: false,
            isMuted: false,
        }

        channel.clients.push(newClient);
        await this.channelRepository.update(channel.id, channel);
    }

    async removeClient(channelName: string, clientId: number) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");
        
        const userIndex = this.getClientIndex(channel.clients, clientId);
        if (userIndex == null)
            throw new NotFoundException(`Client ${clientId} is not member of channel ${channelName}`);
        
        channel.clients.splice(userIndex , 1)
    }

    public async createChannel(dto: CreateChannelDto) {
        const   newChannel = this.channelRepository.create(dto);
        await   this.channelRepository.save(newChannel);
    }

    async deleteChannel(channelName: string) {
        await this.channelRepository.delete(channelName);
    }

    async addMessage(channelName: string, message: Message) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");

        channel.messages.push(message);
        await this.channelRepository.update(channel.id, channel);
    }

    async addAdmin(channelName: string, clientId: number) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");

        channel.clients[this.getClientIndex(channel.clients, clientId)].isAdmin = true;
        await this.channelRepository.update(channel.id, channel);
        
    }

    async muteClient(channelName: string, clientId: number) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");

        channel.clients[this.getClientIndex(channel.clients, clientId)].isMuted = true;
        await this.channelRepository.update(channel.id, channel);
        
    }

    async getMessages(channelName: string) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");

        return channel.messages;
    }

    async getClientById(channelName: string, clientId: number) {
        const channel: Channel = await this.findOneById(channelName);

        if (!channel)
            throw new NotFoundException("Channel not found");
        channel.clients.forEach((client) => {
            if (client.id == clientId)
                return client;
        })

        return null;
    }

    private getClientIndex(clients: ChannelClient[], id: number) {
        let i = 0;
        clients.forEach((client) => {
            if (client.id == id) {
                return i;
            }
            i++;
        })
        return -1;
    }
}