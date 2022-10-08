import { UserStatus } from "src/users/type/users.type";
import { Message } from "./channel.type";
/**
 * PRIVCHAT PART
 */

export type newPrivChatDto = {
    firstUserLogin: string;
    secondUserLogin: string;
    name: string,
}

export type sendMessageDto = {
    chatName: string;
    content: string;
}

export type connectedUser = {
    intraLogin: string;
    username: string;
    status: UserStatus;
}

export type privChatInfo = {
	name: string,
	otherLogin: string,
	otherUsername: string,
	isBlocked: boolean,
	blockedList: string[],
	messages: Message[],
}
