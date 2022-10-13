import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';
import { UsersService } from "src/users/users.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private userService: UsersService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                console.log('token', request?.headers.token);
                if (typeof(request?.headers.token) == "string")
                   return request?.headers.token
                return null
            }]),
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }

    async validate(payload) {
        const user = this.userService.findOneByIntraLogin(payload.login);
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return user;
    }
}