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

    @Column()
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