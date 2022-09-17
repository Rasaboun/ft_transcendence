import { createUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from './types/UserStatus';
export declare class UsersService {
    private readonly userRepository;
    private dataSource;
    private readonly configService;
    constructor(userRepository: Repository<User>, dataSource: DataSource, configService: ConfigService);
    blockUser(idToBlock: number): Promise<void>;
    unblockUser(idToBlock: number): Promise<void>;
    isBlocked(userId: number): Promise<boolean>;
    findAll(): Promise<User[]>;
    findOneById(id: number): Promise<User>;
    findOneByIntraId(id: number): Promise<User>;
    findOneByUsername(username: string): Promise<User>;
    createUser(userDto: createUserDto): Promise<User>;
    removeById(id: number): Promise<void>;
    removeByUsername(username: string): Promise<void>;
    updateGameStats(players: any): Promise<void>;
    getUserStatus(id: number): Promise<UserStatus>;
}
