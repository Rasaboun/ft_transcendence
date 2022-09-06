import { IsAlpha, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class createUserDto {
    @IsNotEmpty()
    intraId: number;
    
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    photoUrl: string;

}