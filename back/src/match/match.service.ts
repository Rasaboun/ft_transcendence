import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { matchDto } from './dto/match.dto';

@Injectable()
export class MatchService {
    constructor(
            @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        private readonly userService: UsersService
    ) {}

    findAll(): Promise<Match[]> {
        return this.matchRepository.find();
    }

    findOneById(id: number): Promise<Match> {
        return this.matchRepository.findOneBy({ id });
    }

    getMatchesById(id: number): Promise<Match[]> {
        return this.matchRepository.find({
            where: [
                { playerOneId: id},
                { playerTwoId: id},
            ],
        })
    }

    async getMatchesByUsername(username: string): Promise<Match[]> {
        const user = await this.userService.findOneByUsername(username);
        if (user === null)
            throw new ForbiddenException("No such user");
        return this.getMatchesById(user.id);
        
    }

    async matchResult(matchDto: matchDto) {
        const newMatch = this.matchRepository.create(matchDto);

        let players: { winnerId: number, loserId: number } = {winnerId: 0, loserId: 0};

        if (matchDto.playerOneScore > matchDto.playerTwoScore){
            players.winnerId = matchDto.playerOneId;
            players.loserId = matchDto.playerTwoId;
        }
        else {
            players.winnerId = matchDto.playerTwoId;
            players.loserId = matchDto.playerOneId;
        }

        this.userService.updateGameStats(players);
        return this.matchRepository.save(newMatch);
    }
}
