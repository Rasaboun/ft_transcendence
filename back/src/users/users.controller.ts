import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';
import { AuthFilter } from 'src/auth/utils/auth.filter';
import { User } from 'src/typeorm';
import { createUserDto } from './dto/createUser.dto';
import { UserStatus } from './types/UserStatus';
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

    @Put('block/:login')
    blockUser(@Param('login') loginToBlock: string)
    {
        return this.usersService.blockUser(loginToBlock)
    }
    
    @Put('unblock/:login')
    unblockUser(@Param('login') loginToBlock: string)
    {
        return this.usersService.unblockUser(loginToBlock)
    }

    @Get('isblocked/:login')
    isBlocked(@Body() dto/* tmp */: any) {
        return this.usersService.isBlocked(dto.callerLogin, dto.login);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':username')
    findOneByUsername(@Param('username') username: string): Promise<User> {
        return this.usersService.findOneByUsername(username);
    }

    @Get('status/:id')
    getUserStatus(@Param('id') userId: number): Promise<UserStatus> {
        return this.usersService.getUserStatus(userId);
    }

    @Delete(':username')
    removeByUsername(@Param('username') username: string): Promise<void> {
        return this.usersService.removeByUsername(username);
    }
}
