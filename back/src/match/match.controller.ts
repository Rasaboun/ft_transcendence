import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/guards/jwt.strategy.guard';
import { Match } from 'src/typeorm';
import { LoginDto } from 'src/users/dto/users.dto';
import { matchDto } from './dto/match.dto';
import { MatchService } from './match.service';

@UseGuards(JwtAuthGuard)
@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Post('result')
    matchResult(@Body() resultDto: matchDto) {
        return this.matchService.matchResult(resultDto);
    }

    @Get('user')
    getMatchesByLogin(@Query() dto: LoginDto): Promise<Match[]> {
        return this.matchService.getMatchesByLogin(dto.login);
    }

    @Get()
    findAll(): Promise<Match[]> {
        return this.matchService.findAll();
    }
}
