import { UserStatus } from "src/users/type/users.type";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    intraLogin: string;

    @Column()
    username: string;

    @JoinColumn({name: 'photoId'})
    @OneToOne(
        () => Photo,
        {
            nullable: true,
        }
    )
    photo: Photo;

    @Column({
        nullable: true,
    })
    photoId: number;

    @Column()
    password: string;

    @Column({
        default: 0,
    })
    victories: number;

    @Column({
        default: 0,
    })
    defeats: number;

    @Column({
        default: 0,
    })
    nbGames: number;

    @Column({
        default: null,
        nullable: true,
    })
    lobbyId: string;

    @Column({
        default: null,
        nullable: true,
    })
    chatId: string;


    @Column({
        nullable: false,
    })
    roomId: string;

    @Column('text', { 
        array: true,
        default: []
    })
    blockedUsers: string[];

    @Column('text', { 
        array: true,
        default: []
    })
    friendList: string[];

    @Column({
        default: UserStatus.offline,
        nullable: false
    })
    status: number;
}