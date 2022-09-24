import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelManager } from './channel/channel.manager';
import { Channel } from '../typeorm/Channel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel/channel.service';
import { ChatController } from './chat.controller';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { SessionModule } from 'src/sessions/sessions.module';
import { PrivChatService } from './privChat/chat.service';
import { PrivChat } from './privChat/privChat';
import { PrivChatManager } from './privChat/privChat.manager';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, PrivChat]),
        TypeOrmModule.forFeature([User]),
        SessionModule,
    ],
    providers: [UsersService, ChannelsService, ChannelManager, PrivChatManager, ChatGateway, PrivChatService],
    controllers: [ChatController]
})
export class ChatModule {}
