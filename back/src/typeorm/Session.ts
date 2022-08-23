import { ISession } from "connect-typeorm/out";
import { Column, Entity, Index, PrimaryColumn, DeleteDateColumn } from "typeorm";

@Entity('sessions')
export class TypeORMSession implements ISession {
    @Index()
    @Column('bigint')
    expiredAt: number;

    @PrimaryColumn('varchar', { length: 255 })
    id: string;

    @DeleteDateColumn({name: 'deleted_at'})
    destroyedAt?: Date;

    @Column('text')
    json: string;
}