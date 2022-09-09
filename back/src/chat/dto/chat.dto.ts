import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Message } from "../chat.type";

export class newChatDto{
    @IsNotEmpty()
    @IsNumber()
    UserIdFirstSender: number;

    @IsNotEmpty()
    @IsNumber()
    UserIdFirstReciever: number;

    @IsNotEmpty()
    mess: Message[];
}

export class newMessageDto{
    @IsNotEmpty()
    @IsNumber()
    Sender: number;

    @IsNotEmpty()
    @IsNumber()
    Reciever: number;

    @IsNotEmpty()
    mess: Message;
}
