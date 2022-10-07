import { Message } from 'src/chat/types/channel.type';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class PrivChat {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstUserLogin: string

  @Column()
  secondUserLogin: string

  @Column('json', {
      default: [],
  })
  messages: Message[];

}
