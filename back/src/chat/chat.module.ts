import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelManager } from './channel/channel.manager';
import { Channel } from '../typeorm/Channel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel/channel.service';
import { ChatController } from './chat.controller';
import { UsersService } from 'src/users/users.service';
import { Session, User } from 'src/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Session]),
        AuthModule,
        UsersModule,
    ],
    providers: [ChannelsService, ChannelManager, ChatGateway],
    controllers: [ChatController]
})
export class ChatModule {}
