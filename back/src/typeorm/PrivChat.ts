import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Message } from 'src/chat/chat.type';

@Entity()
export class PrivChat extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  UserIdFirstSender: number

  @Column()
  UserIdFirstReciever: number;

  @Column({default: -1})
  UserIdBlocker: number;

  @Column("json",
    {default: []})
  mess: Message[];
}
