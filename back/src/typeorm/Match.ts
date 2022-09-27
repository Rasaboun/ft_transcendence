import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    date: Date;

    @Column()
    playerOneLogin: string;

    @Column()
    playerTwoLogin: string;

    @Column()
    playerOneScore: number;

    @Column()
    playerTwoScore: number;
}