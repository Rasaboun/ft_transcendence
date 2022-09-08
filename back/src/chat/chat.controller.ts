import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Channel } from "src/typeorm/Chat";
import { ChannelsService } from "./channel/channel.service";
import { CreateChannelDto, NewClientDto, NewMessageDto } from "./dto/channel.dto";
import { ChannelClient } from "./types/channel.type";

@Controller('chat')
export class ChatController {
    constructor(private readonly channelsService: ChannelsService) {}

    @Post('channel')
    //@UsePipes(ValidationPipe)
    createChannel(@Body() dto: CreateChannelDto) {
        return this.channelsService.createChannel(dto);
    }

    @Post('addClient')
    addClient(@Body() dto: NewClientDto) {
        this.channelsService.addClient(dto.channelName, dto.clientId);
    }


    @Post('addMessage')
    addMessage(@Body() dto: NewMessageDto) {
        this.channelsService.addMessage(dto.channelName, dto.message);
    }

    @Get('channel')
    findOneById(@Body('name') channelName: string): Promise<Channel> {
        return this.channelsService.findOneById(channelName);
    }

    @Get('all')
    getAllChannels() {
        return this.channelsService.findAll();
    }
}