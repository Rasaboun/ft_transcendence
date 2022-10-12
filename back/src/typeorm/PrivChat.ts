import { Message } from 'src/chat/types/channel.type';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class PrivChat {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  firstUserLogin: string

  @Column()
  secondUserLogin: string

  @Column('json', {
      default: [],
  })
  messages: Message[];

  @Column('text', {
    default: [],
    array: true,
  })
  blockedList: string[];

}
