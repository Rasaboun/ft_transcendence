import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Token } from 'client-oauth2';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
                private readonly http: HttpService) {}

    async validateUser(details) {
        const user = await this.userService.findOneByIntraLogin(details.intraLogin);

        // if (!user)
        // {
        //     return this.userService.createUser(details);
        // }
        return (user);
    }

    async signup(dto: {username: string, password: string}) {
        if (await this.userService.findOneByIntraLogin(dto.username))
            return new UnauthorizedException("User already exists");
        await this.userService.createUser({intraLogin: dto.username, ...dto})
    }

}
