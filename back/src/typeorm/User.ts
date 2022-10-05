import { UserStatus } from "src/users/type/users.type";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    intraLogin: string;

    @Column()
    username: string;

    @Column({
        default: "https://cdn.pixabay.com/photo/2016/10/18/18/19/question-mark-1750942_960_720.png",
    })
    photoUrl: string;

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
        nullable: false,
    })
    roomId: string;

    @Column('text', { 
        array: true,
        default: []
    })
    blockedUsers: string[];

    @Column({
        default: 0,
        nullable: false
    })
    status: number;
}