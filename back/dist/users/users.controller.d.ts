import { User } from 'src/typeorm';
import { createUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(userDto: createUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOneByUsername(username: string): Promise<User>;
    removeByUsername(username: string): Promise<void>;
}
