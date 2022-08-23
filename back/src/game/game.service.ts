import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { gameResultDto } from './dto/game.dto';

@Injectable()
export class GameService {
    constructor(
            @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
        private readonly userService: UsersService
    ) {}

    findAll(): Promise<Game[]> {
        return this.gameRepository.find();
    }

    findOneById(id: number): Promise<Game> {
        return this.gameRepository.findOneBy({ id });
    }

    getGamesById(id: number): Promise<Game[]> {
        return this.gameRepository.find({
            where: [
                { playerOneId: id},
                { playerTwoId: id},
            ],
        })
    }

    async getGamesByUsername(username: string): Promise<Game[]> {
        const user = await this.userService.findOneByUsername(username);
        if (user === null)
            throw new ForbiddenException("No such user");
        return this.getGamesById(user.id);
        
    }

    async matchResult(gameDto: gameResultDto) {
        const newGame = this.gameRepository.create(gameDto);

        let players: { winnerId: number, loserId: number } = {winnerId: 0, loserId: 0};

        if (gameDto.playerOneScore > gameDto.playerTwoScore){
            players.winnerId = gameDto.playerOneId;
            players.loserId = gameDto.playerTwoId;
        }
        else {
            players.winnerId = gameDto.playerTwoId;
            players.loserId = gameDto.playerOneId;
        }

        this.userService.updateGameStats(players);
        return this.gameRepository.save(newGame);
    }
}
