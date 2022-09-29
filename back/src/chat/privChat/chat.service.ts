import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PrivChat } from 'src/typeorm';
import { newPrivatChat, PrivChatNewMessageDto } from '../types/privChat.types';
import { Message } from "../types/channel.type";
import { log } from 'console';

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

	async findOneBy(id: number): Promise<PrivChat>
	{
		return this.chatRepository.findOneBy({ id });
	}

	async findOneBySenderId(userIdFirstSender: string)
	{
		const retVal: PrivChat = await this.chatRepository.findOne({
			where : {UserIdFirstSender: userIdFirstSender }
			});
		return retVal;
	}

	findOneBySenderReciever(userIdFirstSender: string, userIdFirstReciever: string): Promise<PrivChat>
	{
		// trying to get it in the right order : if not just returns the natural undefined from findOneBy
		// find by firstName and lastName
		try {
		var retVal: Promise<PrivChat> = this.chatRepository.findOne({
				where: [
					{UserIdFirstSender: userIdFirstSender},
						{UserIdFirstReciever: userIdFirstReciever},
				]});
		if (!retVal)
			retVal = this.chatRepository.findOne( {
				where: [
					{UserIdFirstSender: userIdFirstReciever,
						UserIdFirstReciever: userIdFirstSender,}
				]});
		}
		catch (error)
		{
			console.log('error', error)
		}
		return (retVal);
	}

	async getChat(chat: newPrivatChat)
	{
		const testExist: PrivChat = await this.findOneBySenderReciever(chat.Sender, chat.Reciever);
		if (testExist != null)
			return (testExist);
		return (this.createNewChat(chat));
	}

	async createNewChat(newChat: newPrivatChat) {
		// todo check if the chat repo does not already exist in a safe way
		// query builder not working
		// insertion might pose a probleme since it is in a json file
		
		const newPrivChat: PrivChat = this.chatRepository.create(newChat);

		log(await this.chatRepository.save(newPrivChat));
		const theResult: PrivChat = await this.chatRepository.save(newPrivChat);
		return theResult;
	}
	
	async sendMessage(message: Message)
	{
		// check that both users exist
		// if not return error
		if ((this.usersService.findOneByIntraLogin(message.sender.login)) == undefined
			|| this.usersService.findOneByIntraLogin(message.reciever.login) == undefined)
		{
			throw new NotFoundException("Sender or reciever of the message does not exist.");
		}
		var senderId: string = (await this.usersService.findOneByIntraLogin(message.sender.login)).intraLogin;
		var recieverId: string = (await this.usersService.findOneByIntraLogin(message.reciever.login)).intraLogin;
		var getChatEntry: newPrivatChat = {
				"Sender": senderId,
				"Reciever": recieverId,
				"mess": [message, ],
		};
		const chatMod: PrivChat = await this.getChat(getChatEntry);
		chatMod.mess.push(message);
		return await this.chatRepository.update(chatMod.id, chatMod); 
	}

	async getMessageList(senderId: string, recieverid: string): Promise<Message[]>
	{
		var getChatInstance = await this.findOneBySenderReciever(senderId, recieverid);
		return (getChatInstance?.mess);
	}
// chat exists with name and user
// if chat does'nt exist does the user exist

blockUser(id: number)//: Promise<User>
{
	// if chat doesn't exist -> create it and block the user
	// if chat exists -> find user, find chat...
	//if (this.chatRepository.findOneBy({ UserIdFirstReciever: id }) != null)
	// await (await this.chatRepository.findBy(id);
}
}