import { IsDate, IsDateString, IsNotEmpty, IsNumber, isNumberString, IsNumberString, IsString } from "class-validator";

export class matchDto {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsNumberString()
    playerOneLogin: string;

    @IsNotEmpty()
    @IsNumberString()
    playerTwoLogin: string;

    @IsNotEmpty()
    @IsNumberString()
    playerOneScore: number;

    @IsNotEmpty()
    @IsNumberString()
    playerTwoScore: number;

}