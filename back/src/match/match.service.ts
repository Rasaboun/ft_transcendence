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

    getMatchesByLogin(login: string): Promise<Match[]> {
        return this.matchRepository.find({
            where: [
                { playerOneLogin: login},
                { playerTwoLogin: login},
            ],
        })
    }

    async matchResult(matchDto: matchDto) {
        const newMatch = this.matchRepository.create(matchDto);

        let players: { winnerLogin: string, loserLogin: string} =
                    { winnerLogin: "", loserLogin: ""}

        if (matchDto.playerOneScore > matchDto.playerTwoScore)
        {
            players.winnerLogin = matchDto.playerOneLogin;
            newMatch.winnerLogin = matchDto.playerOneLogin;
            players.loserLogin = matchDto.playerTwoLogin;
        }
        else 
        {
            players.winnerLogin = matchDto.playerTwoLogin;
            newMatch.winnerLogin = matchDto.playerTwoLogin;
            players.loserLogin = matchDto.playerOneLogin;
        }

        this.userService.updateGameStats(players);
        return this.matchRepository.save(newMatch);
    }
}
