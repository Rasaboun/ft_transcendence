import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from './types/UserStatus';

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly configService: ConfigService
    ) { }

    async blockUser(idToBlock: number) {
        const user = this.findOneById(idToBlock);

        if (!user)
            throw new NotFoundException('User to block does not exist');
        
        //Temporary
        // Remplace with real caller id
        const caller = await this.findOneById(1);
        
        caller.blockedUsers.push(idToBlock);
        await this.userRepository.update(
            caller.id,
            caller,
            )
    }

    async unblockUser(idToBlock: number) {
        const user = this.findOneById(idToBlock);

        if (!user)
            throw new NotFoundException('User to unblock does not exist');
        
        //Temporary
        // Remplace with real caller id
        const caller = await this.findOneById(1);
        
        const index = caller.blockedUsers.indexOf(idToBlock);
        if (index == -1)
            return ;
        console.log(index);
        caller.blockedUsers.splice(index, 1);
        await this.userRepository.update(
            caller.id,
            caller,
            )

    }

    async isBlocked(userId: number): Promise<boolean> {
        //Temporary
        // Remplace with real caller id
        const caller = await this.findOneById(1);
        
        return caller.blockedUsers.indexOf(userId) == -1 ? false : true;
        
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOneById(id: number) {
        return this.userRepository.findOneBy({ id });
    }

    findOneByIntraLogin(login: string): Promise<User> {
        return this.userRepository.findOne({
            where: [
                { intraLogin: login},
            ],
        })
    }

    findOneByUsername(username: string){

        if (isNaN(Number(username)))
            return this.userRepository.findOneBy({ username });
        return this.findOneById( Number(username ));
    }

    async createUser(userDto: createUserDto): Promise<User> {

        while (await this.findOneByUsername(userDto.username))
        {
            userDto.username += '_' // Edits username if already in use
        }

        const newUser = this.userRepository.create(userDto);
        return this.userRepository.save(newUser);
    }
    
    async removeById(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async removeByUsername(username: string): Promise<void> {
        if (isNaN(Number(username)))
            await this.userRepository.delete({username: username});
        else
            await this.userRepository.delete(username);
    }

    async updateGameStats(players)
    {
        const winner = await this.findOneById(players.winnerId);
        const loser = await this.findOneById(players.loserId);

        winner.victories++;
        winner.nbGames++;
        await this.userRepository.update(
            winner.id,
            winner
        );

        loser.defeats++;
        loser.nbGames++;
        await this.userRepository.update(
            loser.id,
            loser
        );
    }

    async getUserStatus(id: number): Promise<UserStatus> {
        return await (await this.findOneById(id)).status;
    }

}
