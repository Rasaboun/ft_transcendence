import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
//import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';
import { Match } from 'src/typeorm';
import { matchDto } from './dto/match.dto';
import { MatchService } from './match.service';

//@UseGuards(AuthenticatedGuard)
//@UseFilters(AuthFilter)
@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Post('result')
    matchResult(@Body() resultDto: matchDto) {
        return this.matchService.matchResult(resultDto);
    }

    @Get('user')
    getMatchesByLogin(@Query() dto: {login: string}): Promise<Match[]> {
        return this.matchService.getMatchesByLogin(dto.login);
    }

    @Get()
    findAll(): Promise<Match[]> {
        return this.matchService.findAll();
    }
}
