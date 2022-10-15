import { GameStats, UserStatus } from "src/users/type/users.type";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    intraLogin: string;

    @Column({
        nullable: true,
        default: null,
    })
    username: string;

    @Column({
        nullable: true,
    })
    twoFactorAuthenticationSecret?: string;

    @Column({
        default: false,
    })
    isTwoFactorAuthenticationEnabled: boolean;

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

    @Column('json', {
        default: null,
    })
    gameStats: GameStats;


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