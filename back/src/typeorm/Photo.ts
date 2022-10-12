import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column({
        type: 'bytea',
    })
    data: Buffer;
}