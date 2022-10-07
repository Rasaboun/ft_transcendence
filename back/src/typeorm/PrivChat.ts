import { Message } from 'src/chat/types/channel.type';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class PrivChat {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  UserIdFirstSender: string

  @Column()
  UserIdFirstReciever: string

  @Column({default: -1})
  UserIdBlocker: number;

  @Column("json",
    {default: []})
  mess: Message[];
}
