import { HttpService } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private readonly userService;
    private readonly http;
    constructor(userService: UsersService, http: HttpService);
    validateUser(details: any): Promise<import("../typeorm").User>;
}
