import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';
import { AuthFilter } from 'src/auth/utils/auth.filter';
import { User } from 'src/typeorm';
import { createUserDto, updateStatusDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

//@UseGuards(AuthenticatedGuard)
//@UseFilters(AuthFilter)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('create')
    createUser(@Body() userDto: createUserDto): Promise<User> {
        return this.usersService.createUser(userDto);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':username')
    findOneByUsername(@Param('username') username: string): Promise<User> {
        return this.usersService.findOneByUsername(username);
    }

    @Get('status')
    getUserStatus(@Body('id') userId: number) {
        return this.usersService.getUserStatus(userId);
    }


    @Post('status')
    setUserStatus(@Body() dto: updateStatusDto) {
        return this.usersService.setUserStatus(dto);
    }

    @Delete(':username')
    removeByUsername(@Param('username') username: string): Promise<void> {
        return this.usersService.removeByUsername(username);
    }
}
