import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { createUserDto } from "src/users/dto/createUser.dto";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local')
{
    constructor(private readonly authService: AuthService)
    {
        super();
    }

    async validate(username: string, password: string)
    {
        console.log("In strategy");
        const details: createUserDto = {
            intraLogin: username,
            username: username,
            password: password,
        };
        const user = await this.authService.validateUser(details);
        console.log(user);
        if (!user || user.password != details.password)
        {
            throw new UnauthorizedException("Wrong username or password");
        }
        return user;
    }
}