import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelManager } from './channel/channel.manager';
import { Channel } from '../typeorm/Channel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel/channel.service';
import { ChatController } from './chat.controller';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/typeorm';
import { SessionManager } from 'src/sessions/sessions.manager';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel]),
        TypeOrmModule.forFeature([User])],
    providers: [UsersService, ChannelsService, ChannelManager, ChatGateway, SessionManager],
    controllers: [ChatController]
})
export class ChatModule {}
