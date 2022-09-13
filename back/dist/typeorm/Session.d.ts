import { ISession } from "connect-typeorm/out";
export declare class TypeORMSession implements ISession {
    expiredAt: number;
    id: string;
    destroyedAt?: Date;
    json: string;
}
