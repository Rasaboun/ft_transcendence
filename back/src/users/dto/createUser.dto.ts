import { IsAlpha, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";
import { UserStatus } from "../type/users.type";

export class createUserDto {
    @IsNotEmpty()
    @IsNumber()
    intraId: number;
    
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    photoUrl: string;

}

export class updateStatusDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    status: UserStatus;
}