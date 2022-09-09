import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelManager } from './channel/channel.manager';
import { ChatController } from './chat.controller';
import { PrivChatService } from './chat.service';
import { Channel } from '../typeorm/Channel';
import { PrivChat } from 'src/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel/channel.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, PrivChat]), UsersModule
    ],
    controllers: [ChatController],
    providers: [ChannelsService, ChannelManager, ChatGateway, PrivChatService],
    exports: [PrivChatService],
})
export class ChatModule {}
