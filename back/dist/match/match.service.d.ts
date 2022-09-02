import { Match } from 'src/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { matchDto } from './dto/match.dto';
export declare class MatchService {
    private readonly matchRepository;
    private readonly userService;
    constructor(matchRepository: Repository<Match>, userService: UsersService);
    findAll(): Promise<Match[]>;
    findOneById(id: number): Promise<Match>;
    getMatchesById(id: number): Promise<Match[]>;
    getMatchesByUsername(username: string): Promise<Match[]>;
    matchResult(matchDto: matchDto): Promise<Match>;
}
