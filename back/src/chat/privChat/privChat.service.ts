import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PrivChat } from 'src/typeorm';
import { newPrivChatDto, privChatInfo } from '../types/privChat.type';
import { Message } from "../types/channel.type";
import { v4 } from 'uuid';

@Injectable()
export class PrivChatService {
	constructor(
		@InjectRepository(PrivChat)
		private readonly chatRepository: Repository<PrivChat>,
		private readonly usersService: UsersService,
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

	async findOneByUsers(firstUserLogin: string, secondUserLogin: string): Promise<PrivChat>
	{
		let chat = await this.chatRepository.findOne({
				where: [
				{
					firstUserLogin: firstUserLogin,
					secondUserLogin: secondUserLogin
				},
				]});
		if (!chat)
			chat = await this.chatRepository.findOne( {
				where: [
				{
					firstUserLogin: secondUserLogin,
					secondUserLogin: firstUserLogin,
				}
				]});
		return (chat);
	}

	async createNewChat(firstUserLogin: string, secondUserLogin: string) {
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
	}

	async getMessageList(chatName: string, callerLogin: string): Promise<Message[]>
	{
		const chat = await this.findOneByName(chatName)
		if (!chat)
			throw new NotFoundException("Chat not found");
		if (chat.blockedList.length > 0 && chat.blockedList.indexOf(callerLogin) == -1)
			return [];
		const firstUser = await this.usersService.findOneByIntraLogin(chat.firstUserLogin);
		const secondUser = await this.usersService.findOneByIntraLogin(chat.secondUserLogin);

		for (let i = 0; i < chat.messages.length; i++)
		{
			if (chat.messages[i].sender.login == firstUser.intraLogin)
				chat.messages[i].sender.username = firstUser.username;
			else
				chat.messages[i].sender.username = secondUser.username;
		}
		await this.chatRepository.update(chat.id, chat);
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

	async getOtherLogin(callerLogin: string, chatName: string)
	{
		const chat = await this.findOneByName(chatName);
		if (chat.firstUserLogin == callerLogin)
			return chat.secondUserLogin;
		return chat.firstUserLogin;
	}

	async updateBlockedList(chat: PrivChat)
	{
		if (await this.usersService.isBlocked(chat.firstUserLogin, chat.secondUserLogin) && chat.blockedList.indexOf(chat.secondUserLogin) == -1)
			chat.blockedList.push(chat.secondUserLogin);
		else if (await this.usersService.isBlocked(chat.secondUserLogin, chat.firstUserLogin) && chat.blockedList.indexOf(chat.firstUserLogin) == -1)
			chat.blockedList.push(chat.firstUserLogin);
		
		if (!await this.usersService.isBlocked(chat.firstUserLogin, chat.secondUserLogin) && chat.blockedList.indexOf(chat.secondUserLogin) != -1)
			chat.blockedList.splice(chat.blockedList.indexOf(chat.secondUserLogin), 1);
		else if (!await this.usersService.isBlocked(chat.secondUserLogin, chat.firstUserLogin) && chat.blockedList.indexOf(chat.firstUserLogin) != -1)
			chat.blockedList.splice(chat.blockedList.indexOf(chat.firstUserLogin), 1);
		
	}

	async getChatInfo(chatName: string, callerLogin: string): Promise<privChatInfo>
	{
		try
		{
			const chat = await this.findOneByName(chatName);
			const otherLogin = callerLogin == chat.firstUserLogin ? chat.secondUserLogin : chat.firstUserLogin;
			const secondUser = await this.usersService.findOneByIntraLogin(otherLogin);
			await this.updateBlockedList(chat);
			await this.chatRepository.update(chat.id, chat);
			return {
				name: chat.name,
				otherLogin: secondUser.intraLogin,
				otherUsername: secondUser.username,
				isBlocked: chat.blockedList.length > 0 ? true : false,
				blockedList: chat.blockedList,
				messages:  await this.getMessageList(chat.name, callerLogin),
			}

		}
		catch (e) { throw e }
	}

}