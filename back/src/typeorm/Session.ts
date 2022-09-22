import { Lobby } from "src/game/lobby/lobby";
import { Column, Entity,  PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    sessionId: string;

    @Column()
    roomId: string;

    @Column()
    login: string;

    @Column({nullable: true,})
    lobbyId: string;

    @Column('bigint')
    expiresAt: number;
}