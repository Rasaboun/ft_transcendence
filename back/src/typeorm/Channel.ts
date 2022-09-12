import { ChannelClient, Message } from "src/chat/types/channel.type";
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

    @Column('json', {
        default: [],
    })
    messages: Message[];

    @Column({
        default: false,
    })
    isPasswordProtected: boolean;

    @Column()
    password: string;

    @Column({
        default: false,
    })
    isPrivate: boolean;

    @Column('text', {
        default: [],
        array: true,
    })
    inviteList: string[];
}