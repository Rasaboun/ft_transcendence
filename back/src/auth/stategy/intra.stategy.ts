import { HttpService } from "@nestjs/axios";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { createUserDto } from "src/users/dto/createUser.dto";
import { Code } from "typeorm";
import { AuthService } from "../auth.service";

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra') {
    constructor(
        private readonly authService: AuthService,
        private readonly http: HttpService, 
    ) {
        super({
            clientID   : process.env.UID_42,
            clientSecret: process.env.SECRET_42,
            callbackURL : process.env.REDIRECT_URI_42,
        })
    } 

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const details: createUserDto = {
            intraId: profile.id,
            username: profile.username,
            photoUrl: profile.photos[0].value
        };

        return this.authService.validateUser(details);
    }
}