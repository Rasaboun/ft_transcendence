import { Body, Controller, Get, Param, ParseIntPipe, Post, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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

    @Get(':id')
    findOneById(@Param('id', ParseIntPipe) id: number): Promise<Match> {
        return this.matchService.findOneById(id);
    }

    @Get('user/:username')
    getMatchsByUsername(@Param('username') username: string): Promise<Match[]> {
        return this.matchService.getMatchesByUsername(username);
    }

    @Get()
    findAll(): Promise<Match[]> {
        return this.matchService.findAll();
    }
}
