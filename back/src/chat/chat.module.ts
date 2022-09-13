import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelManager } from './channel/channel.manager';
import { Channel } from '../typeorm/Channel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel/channel.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel])],
    providers: [ChannelsService, ChannelManager, ChatGateway]
})
export class ChatModule {}
