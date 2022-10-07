import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelManager } from './channel/channel.manager';
import { Channel } from '../typeorm/Channel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel/channel.service';
import { UsersService } from 'src/users/users.service';
import { User, PrivChat } from 'src/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { PrivChatService } from './privChat/chat.service';
import { PrivChatManager } from './privChat/privChat.manager';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, PrivChat]),
        TypeOrmModule.forFeature([User]),
        AuthModule,
        UsersModule,
    ],
    providers: [ChannelsService, ChannelManager, ChatGateway, PrivChatManager, PrivChatService],
})
export class ChatModule {}
