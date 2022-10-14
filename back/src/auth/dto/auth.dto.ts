import { IsNotEmpty, IsString } from "class-validator";

export class TwoFactorAuthenticationDto {
    @IsNotEmpty()
    @IsString()
    login: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}