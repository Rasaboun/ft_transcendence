import { IsNotEmpty} from "class-validator";
import { ChannelClient, Message } from "../types/channel.type";

export class CreateChannelDto {
    @IsNotEmpty()
    name: string;
        
    @IsNotEmpty()
    isPrivate: boolean;
    
    @IsNotEmpty()
    password: string;
    
    @IsNotEmpty()
    ownerId: string;
    
}

export class NewClientDto {
    @IsNotEmpty()
    channelName: string;

    @IsNotEmpty()
    clientId: string;
}

export class NewMessageDto {
    @IsNotEmpty()
    channelName: string;

    @IsNotEmpty()
    message: Message;
}