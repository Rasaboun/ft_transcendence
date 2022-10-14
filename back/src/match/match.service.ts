import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/typeorm';
import { MatchInfo } from 'src/users/type/users.type';
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

        let matchInfo: MatchInfo = {
                     winnerLogin: "", loserLogin: "",
                     winnerScore: 0, loserScore: 0,
                    }

        if (matchDto.playerOneScore > matchDto.playerTwoScore)
        {
            matchInfo.winnerLogin = matchDto.playerOneLogin;
            matchInfo.winnerScore = matchDto.playerOneScore;

            newMatch.winnerLogin = matchDto.playerOneLogin;

            matchInfo.loserLogin = matchDto.playerTwoLogin;
            matchInfo.loserScore = matchDto.playerTwoScore;
        }
        else 
        {
            matchInfo.winnerLogin = matchDto.playerTwoLogin;
            matchInfo.winnerScore = matchDto.playerTwoScore;

            newMatch.winnerLogin = matchDto.playerTwoLogin;

            matchInfo.loserLogin = matchDto.playerOneLogin;
            matchInfo.loserScore = matchDto.playerOneScore;
        }

        await this.userService.updateGameStats(matchInfo);
        return this.matchRepository.save(newMatch);
    }
}
