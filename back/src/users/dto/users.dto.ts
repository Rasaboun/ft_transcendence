import { IsAlpha, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";
import { UserStatus } from "../type/users.type";

export class createUserDto {
    @IsNotEmpty()
    intraLogin: string;
    
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    roomId: string;
}

export class updateStatusDto {
    @IsNotEmpty()
    @IsString()
    login: string;

    @IsNotEmpty()
    @IsNumber()
    status: UserStatus;
}

export class updatePhotoDto {
    @IsNotEmpty()
    @IsString()
    login: string;

    @IsNotEmpty()
    @IsString()
    photoUrl: string;
}

export class updateUsernameDto {
    @IsNotEmpty()
    @IsString()
    login: string;

    @IsNotEmpty()
    @IsString()
    username: string;
}


export class blockUserDto {
    @IsNotEmpty()
    @IsString()
    callerLogin: string;

    @IsNotEmpty()
    @IsString()
    targetLogin: string;
}