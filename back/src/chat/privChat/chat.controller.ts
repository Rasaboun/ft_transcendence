import { Controller, Post, Put, Param, Body, Request } from '@nestjs/common';
import { timestamp } from 'rxjs';
import { PrivChatService } from './chat.service';
import {newChatDto, newMessageDto} from "../dto/chat.dto";

@Controller('chat')
export class ChatController {
	constructor (private chatService: PrivChatService) {}
	@Put('/id')
	update(@Param('id') id: string) {
	 return `This action updates a #${id} cat`;
	}

	@Put('send')
	sendMessage(@Body() newChatMessage: newMessageDto)
	{
		return (this.chatService.sendMessage(newChatMessage));
	}

	@Put('send')
	createChannel(@Body() newChatMessage: newMessageDto)
	{
		return (this.chatService.sendMessage(newChatMessage));
	}

	@Put('newChat')
	createChat(@Body() newChat: newChatDto)
	{
		return (this.chatService.createNewChat(newChat));
	}


	@Post('test')
	sendTheMessage(@Body() newChatMessage: string)
	{
		return (`This is the thing ${JSON.stringify(newChatMessage)}` );
		// return (this.chatService.sendMessage(newChatMessage.senderId,
		// 	newChatMessage.senderId,
		// 	newChatMessage.message,
		// 	newChatMessage.timeSent));
	}
}
