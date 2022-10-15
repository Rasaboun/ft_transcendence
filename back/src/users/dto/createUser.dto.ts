import { IsAlpha, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class createUserDto {
    @IsNotEmpty()
    intraLogin: string;

    @IsNotEmpty()
    photoUrl: string;

    @IsNotEmpty()
    roomId: string;
}