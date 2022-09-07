import { IsAlpha, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class createUserDto {
    @IsNotEmpty()
    @IsNumber()
    intraId: number;
    
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    photoUrl: string;

}