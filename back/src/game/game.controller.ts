import { Body, Controller, Get, Param, ParseIntPipe, Post, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';
import { AuthFilter } from 'src/auth/utils/auth.filter';
import { Game } from 'src/typeorm';
import { gameResultDto } from './dto/game.dto';
import { GameService } from './game.service';

@UseGuards(AuthenticatedGuard)
@UseFilters(AuthFilter)
@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post('result')
    @UsePipes(ValidationPipe)
    matchResult(@Body() resultDto: gameResultDto) {
        return this.gameService.matchResult(resultDto);
    }

    @Get(':id')
    findOneById(@Param('id', ParseIntPipe) id: number): Promise<Game> {
        return this.gameService.findOneById(id);
    }

    @Get('user/:username')
    getUserGamesByUsername(@Param('username') username: string): Promise<Game[]> {
        return this.gameService.getGamesByUsername(username);
    }

    @Get()
    findAll(): Promise<Game[]> {
        return this.gameService.findAll();
    }
}
