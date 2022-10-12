import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';
import { UsersService } from "src/users/users.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private userService: UsersService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                console.log("token", request.headers.token);
                console.log(typeof(request?.headers.token));
                if (typeof(request?.headers.token) == "string")
                   return request?.headers.token
                return null
            }]),
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }

    async validate(payload) {
        console.log("payload", payload)
        console.log('in validate');
        return this.userService.findOneByIntraLogin(payload.login);
    }
}