import { IsDate, IsDateString, IsNotEmpty, isNumber, IsNumber, isNumberString, IsNumberString, IsString } from "class-validator";

export class matchDto {
    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    @IsString()
    playerOneLogin: string;

    @IsNotEmpty()
    @IsString()
    playerTwoLogin: string;

    @IsNotEmpty()
    @IsNumberString()
    playerOneScore: number;

    @IsNotEmpty()
    @IsNumberString()
    playerTwoScore: number;

}