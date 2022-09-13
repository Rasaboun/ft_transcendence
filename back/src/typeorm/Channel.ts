import { ChannelClient, ChannelModes, Message } from "src/chat/types/channel.type";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    ownerId: string

    @Column('json', {
        default: [],
    })
    clients: ChannelClient[];

    @Column({
        default: ChannelModes.Public,
    })
    mode: ChannelModes
    
    @Column('json', {
        default: [],
    })
    messages: Message[];

    @Column()
    password: string;

    @Column('text', {
        default: [],
        array: true,
    })
    inviteList: string[];
}