import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PrivChat } from 'src/typeorm';
import { newChatDto, newMessageDto} from "../dto/chat.dto";
import { Message } from "../chat.type";
import { log } from 'console';

@Injectable()
export class PrivChatService {
	constructor(
		@InjectRepository(PrivChat)
		private chatRepository: Repository<PrivChat>,
		private usersService: UsersService,
	) {}

	findAll() : Promise<PrivChat[]> {
		return this.chatRepository.find();
	}

	findOneBy(id: number): Promise<PrivChat>
	{
		return this.chatRepository.findOneBy({ id });
	}

	async findOneBySenderId(userIdFirstSender: number)
	{
		const retVal: PrivChat = await PrivChat.findOne({where : {UserIdFirstSender: userIdFirstSender }});
		return retVal;
	}

	async findOneBySenderReciever(userIdFirstSender: number, userIdFirstReciever: number)
	{
		// trying to get it in the right order : if not just returns the natural undefined from findOneBy
		var retVal: PrivChat = await PrivChat.findOne({where: { UserIdFirstSender: userIdFirstSender, UserIdFirstReciever: userIdFirstReciever }});
		if (!retVal)
			retVal = await PrivChat.findOne({where: { UserIdFirstSender: userIdFirstReciever , UserIdFirstReciever: userIdFirstSender}});
		return (retVal);
	}

	async getChat(chat: newChatDto)
	{
		const testExist: PrivChat = await this.findOneBySenderReciever(chat.UserIdFirstSender, chat.UserIdFirstReciever);
		if (testExist != null)
			return (testExist);
		return (this.createNewChat(chat));
	}

	async createNewChat(newChat: newChatDto) {
		// todo check if the chat repo does not already exist in a safe way
		// query builder not working
		// insertion might pose a probleme since it is in a json file
		const newPrivChat: PrivChat = this.chatRepository.create(newChat);

		log(await this.chatRepository.save(newPrivChat));
		const theResult: PrivChat = await this.chatRepository.save(newPrivChat);
		return theResult;
	}
	
	async sendMessage(newMess: newMessageDto)
	{
		var userIdFirstSender: number = newMess.Sender;
		var userIdFirstReciever: number = newMess.Reciever;

		// check that both users exist
		// if not return error
		if (this.usersService.findOneById(userIdFirstSender) == null
			|| this.usersService.findOneById(userIdFirstReciever) == null)
		{
			throw new NotFoundException("Sender or reciever of the message does not exist.");
		}
		var chatInsert: Message = {"senderId": userIdFirstSender, "mess": newMess.mess.mess};
		var getChatEntry: newChatDto = {
				"UserIdFirstSender": userIdFirstSender,
				"UserIdFirstReciever": userIdFirstReciever,
				"mess": [chatInsert ],
		};
		const chatMod: PrivChat = await this.getChat(getChatEntry);
		chatMod.mess.push(chatInsert);
		return await this.chatRepository.update(chatMod.id, chatMod); 
	}

	async getMessageList(senderId: number, recieverid: number): Promise<Message[]>
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