import { IsDate, IsDateString, IsNotEmpty, IsNumber, isNumberString, IsNumberString, IsString } from "class-validator";

export class matchDto {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsNumberString()
    playerOneId: number;

    @IsNotEmpty()
    @IsNumberString()
    playerTwoId: number;

    @IsNotEmpty()
    @IsNumberString()
    playerOneScore: number;

    @IsNotEmpty()
    @IsNumberString()
    playerTwoScore: number;

}