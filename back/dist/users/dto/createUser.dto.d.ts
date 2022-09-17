import { UserStatus } from "../type/users.type";
export declare class createUserDto {
    intraId: number;
    username: string;
    photoUrl: string;
}
export declare class updateStatusDto {
    userId: number;
    status: UserStatus;
}
