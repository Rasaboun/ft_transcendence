import { IsAlpha, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class createUserDto {
    @IsNotEmpty()
    intraLogin: string;
    
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

}