import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { Request } from 'express';

@Injectable()
export class JwtFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor')
{
    constructor(
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentication;
            }]),
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: any)
    {
        const user = await this.usersService.findOneByIntraLogin(payload.login);
        if (!user.isTwoFactorAuthenticationEnabled)
            return user;
        if (payload.twoFactorAuthEnabled)
            return user;
    }
}