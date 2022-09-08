import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createUserDto, updateStatusDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly configService: ConfigService
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOneById(id: number) {
        return this.userRepository.findOneBy({ id });
    }

    findOneByIntraId(id: number) {
        return this.userRepository.findOne({
            where: [
                { intraId: id},
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

    async getUserStatus(userId: number)
    {
        const user: User = await this.findOneById(userId);
        
        if (!user)
            throw new NotFoundException("No such user");
        return user.status;
    }
    
    async setUserStatus(dto: updateStatusDto)
    {
        const user: User = await this.findOneById(dto.userId);
        
        if (!user)
            throw new NotFoundException("No such user");
        user.status = dto.status;

        await this.userRepository.update(
            user.id,
            user,
        );
    }
}
