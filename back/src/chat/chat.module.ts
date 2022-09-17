import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelManager } from './channel/channel.manager';
import { ChatController } from './privChat/chat.controller';
import { PrivChatService } from './privChat/chat.service';
import { Channel } from '../typeorm/Channel';
import { PrivChat } from 'src/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel/channel.service';
import { UsersModule } from 'src/users/users.module';
import { PrivChatManager } from './privChat/privChat.manager';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, PrivChat]), UsersModule
    ],
    controllers: [ChatController],
    providers: [ChannelsService, ChannelManager, ChatGateway, PrivChatService, PrivChatManager],
    exports: [PrivChatService],
})
export class ChatModule {}
