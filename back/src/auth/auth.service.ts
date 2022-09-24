import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Token } from 'client-oauth2';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
                private readonly http: HttpService) {}

    async validateUser(details) {
        const user = await this.userService.findOneByIntraLogin(details.intraId);

        if (!user)
        {
            return this.userService.createUser(details);
        }
        return (user);
    }

}
