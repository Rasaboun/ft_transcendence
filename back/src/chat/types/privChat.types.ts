import { Message } from "./channel.type";
/**
 * PRIVCHAT PART
 */

 export class PrivChatNewMessageDto{
    Sender: number;

    Reciever: number;

    mess: Message;
}

 export class newPrivatChat{
    UserIdFirstSender: string;

    UserIdFirstReciever: string;

    mess: Message[];
}
