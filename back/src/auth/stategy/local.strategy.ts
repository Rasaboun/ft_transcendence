import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local')
{
    constructor(private authService: AuthService)
    {
        super({
            usernameField: 'intraLogin',
        })
    }

    async validate(intraLogin: string) {
        console.log("In validate");
    }
}