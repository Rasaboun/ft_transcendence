import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    date: Date;

    @Column()
    playerOneId: number;

    @Column()
    playerTwoId: number;

    @Column()
    playerOneScore: number;

    @Column()
    playerTwoScore: number;
}