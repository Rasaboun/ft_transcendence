import { ChannelClient, Message } from "src/chat/types/channel.type";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', {
        array: true,
        default: [],
    })
    clients: ChannelClient[];

    @Column('text', {
        array: true,
        default: [],
    })
    messages: Message[];

    @Column()
    isPrivate: boolean;

    @Column()
    password: string;
}