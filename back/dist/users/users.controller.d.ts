import { User } from 'src/typeorm';
import { createUserDto } from './dto/createUser.dto';
import { UserStatus } from './types/UserStatus';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(userDto: createUserDto): Promise<User>;
    blockUser(idToBlock: number): Promise<void>;
    unblockUser(idToBlock: number): Promise<void>;
    isBlocked(userId: number): Promise<boolean>;
    findAll(): Promise<User[]>;
    findOneByUsername(username: string): Promise<User>;
    getUserStatus(userId: number): Promise<UserStatus>;
    removeByUsername(username: string): Promise<void>;
}
