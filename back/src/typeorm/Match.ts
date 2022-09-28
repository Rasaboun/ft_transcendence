import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    date: string;

    @Column()
    playerOneLogin: string;

    @Column()
    playerTwoLogin: string;

    @Column()
    playerOneScore: number;

    @Column()
    playerTwoScore: number;

    @Column()
    winnerLogin: string;
}