import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelManager } from './channel/channel.manager';
import { ChatController } from './chat.controller';
import { Channel } from '../typeorm/Channel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel/channel.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel])],
    controllers: [ChatController],
    providers: [ChannelsService, ChannelManager, ChatGateway]
})
export class ChatModule {}
