import { Match } from 'src/typeorm';
import { matchDto } from './dto/match.dto';
import { MatchService } from './match.service';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    matchResult(resultDto: matchDto): Promise<Match>;
    findOneById(id: number): Promise<Match>;
    getMatchsByUsername(username: string): Promise<Match[]>;
    findAll(): Promise<Match[]>;
}
