import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PrivChat } from 'src/typeorm';
import { newPrivChatDto } from '../types/privChat.type';
import { Message } from "../types/channel.type";
import { log } from 'console';
import { v4 } from 'uuid';

@Injectable()
export class PrivChatService {
	constructor(
		@InjectRepository(PrivChat)
		private readonly chatRepository: Repository<PrivChat>,
		private readonly usersService: UsersService,
		private dataSource: DataSource,
	) {}

	async findAll() : Promise<PrivChat[]> {
		return this.chatRepository.find();
	}

	async findOneById(id: number): Promise<PrivChat>
	{
		return this.chatRepository.findOneBy({ id });
	}

	async findOneByName(name: string): Promise<PrivChat>
	{
		return this.chatRepository.findOneBy({ name });
	}

	findOneByUsers(firstUserLogin: string, secondUserLogin: string): Promise<PrivChat>
	{
		// trying to get it in the right order : if not just returns the natural undefined from findOneBy
		// find by firstName and lastName
		let chat: Promise<PrivChat> = this.chatRepository.findOne({
				where: [
					{firstUserLogin: firstUserLogin},
						{secondUserLogin: secondUserLogin},
				]});
		if (!chat)
			chat = this.chatRepository.findOne( {
				where: [
					{firstUserLogin: secondUserLogin,
						secondUserLogin: firstUserLogin,}
				]});
		return (chat);
	}

	// async getChat(chat: newPrivatChat)
	// {
	// 	const testExist: PrivChat = await this.findOneByUsers(chat.firstUserLogin, chat.secondUserLogin);
	// 	if (testExist != null)
	// 		return (testExist);
	// 	return (this.createNewChat(chat));
	// }

	async createNewChat(firstUserLogin: string, secondUserLogin: string) {
		// todo check if the chat repo does not already exist in a safe way
		// query builder not working
		// insertion might pose a probleme since it is in a json file
		const dto: newPrivChatDto = {
			firstUserLogin,
			secondUserLogin,
			name: v4(),
		}
		const newPrivChat: PrivChat = this.chatRepository.create(dto);

		await this.chatRepository.save(newPrivChat);
		return newPrivChat;
	}
	
	async addMessage(chatName: string, message: Message)
	{
		const chat = await this.findOneByName(chatName);
		if (!chat)
			throw new NotFoundException("Chat not found");
		chat.messages.push(message);
		await this.chatRepository.update(chat.id, chat);
		// check that both users exist
		// if not return error
		// if ((this.usersService.findOneByIntraLogin(message.sender.login)) == undefined
		// 	|| this.usersService.findOneByIntraLogin(message.reciever.login) == undefined)
		// {
		// 	throw new NotFoundException("Sender or reciever of the message does not exist.");
		// }
		// var senderId: string = (await this.usersService.findOneByIntraLogin(message.sender.login)).intraLogin;
		// var recieverId: string = (await this.usersService.findOneByIntraLogin(message.reciever.login)).intraLogin;
		// var getChatEntry: newPrivatChat = {
		// 		"UserIdFirstSender": senderId,
		// 		"UserIdFirstReciever": recieverId,
		// 		"mess": [message, ],
		// };
		// const chatMod: PrivChat = await this.getChat(getChatEntry);
		// chatMod.mess.push(message);
		// return await this.chatRepository.update(chatMod.id, chatMod); 
	}

	async getMessageList(chatId: number): Promise<Message[]>
	{
		const chat = await this.findOneById(chatId);
		if (!chat)
			throw new NotFoundException("Chat not found");
		return (chat.messages);
	}

	async blockUser(chatName: string, targetLogin: string)
	{
		const chat = await this.findOneByName(chatName);

		if (chat.blockedList.indexOf(targetLogin) == -1)
		{
			chat.blockedList.push(targetLogin);
			await this.chatRepository.update(chat.id, chat);
		}
	}

	async unblockUser(chatName: string, targetLogin: string)
	{
		const chat = await this.findOneByName(chatName);

		const index = chat.blockedList.indexOf(targetLogin);
		if (index >= 0)
		{  
			chat.blockedList.splice(index, 1);
			await this.chatRepository.update(chat.id, chat);
		}
	}

	async isBlocked(chatName: string, targetLogin: string)
	{
		const chat = await this.findOneByName(chatName);

		const index = chat.blockedList.indexOf(targetLogin);
		if (index >= 0)
			return true;
		return false;
	}
}