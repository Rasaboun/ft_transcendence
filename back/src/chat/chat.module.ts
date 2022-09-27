import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelManager } from './channel/channel.manager';
import { Channel } from '../typeorm/Channel';
import { PrivChat } from 'src/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel/channel.service';
import { ChatController } from './chat.controller';
import { UsersService } from 'src/users/users.service';
import { Session, User } from 'src/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { PrivChatService } from './privChat/chat.service';
import { PrivChat } from './privChat/privChat';
import { PrivChatManager } from './privChat/privChat.manager';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, PrivChat]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Session]),
        AuthModule,
        UsersModule,
    ],
    providers: [ChannelsService, ChannelManager, ChatGateway, PrivChatManager, PrivChatService],
    controllers: [ChatController]
})
export class ChatModule {}
