import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'client-oauth2';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
                private readonly http: HttpService,
                private readonly jwtService: JwtService,
                ) {}

    async validateUser(details) {
        const user = await this.userService.findOneByIntraLogin(details.intraLogin);

        if (user && user.password == details.password)
        {
            return user
        }
        return (null);
    }

    async signup(dto: {username: string, password: string}) {
        if (await this.userService.findOneByIntraLogin(dto.username))
        {
            console.log("here");
            return new UnauthorizedException("User already exists");
        }
        await this.userService.createUser({intraLogin: dto.username, ...dto})
        return true;
    }

    async login(dto: any)
    {
        const user = await this.userService.findOneByIntraLogin(dto.username);

        const payload = { username: dto.username, password: dto.password};
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                intraLogin: user.intraLogin,
                surname: user.username,
            }
        }
    }

}
