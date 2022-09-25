import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';
import { AuthFilter } from 'src/auth/utils/auth.filter';
import { User } from 'src/typeorm';
import { blockUserDto, createUserDto, updatePhotoDto, updateStatusDto, updateUsernameDto } from './dto/users.dto';
import { UserStatus } from './type/users.type';
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

    @Put('block')
    blockUser(@Body() dto: blockUserDto)
    {
        return this.usersService.blockUser(dto.callerLogin, dto.targetLogin)
    }
    
    @Put('unblock')
    unblockUser(@Body() dto: blockUserDto)
    {
        return this.usersService.unblockUser(dto.callerLogin, dto.targetLogin)
    }

    @Put('status')
    setUserStatus(@Body() dto: updateStatusDto) {
        return this.usersService.setUserStatus(dto.login, dto.status);
    }

    @Put('photo')
    setUserPhoto(@Body() dto: updatePhotoDto) {
        return this.usersService.setUserPhoto(dto.login, dto.photoUrl);
    }

    @Put('username')
    setUserUsername(@Body() dto: updateUsernameDto) {
        return this.usersService.setUserUsername(dto.login, dto.username);
    }

    @Get('isblocked')
    isBlocked(@Body() dto: blockUserDto) {
        return this.usersService.isBlocked(dto.callerLogin, dto.targetLogin);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get('profile')
    findOneBylogin(@Body('') dto: {login: string} ): Promise<User> {
        return this.usersService.findOneByIntraLogin(dto.login);
    }

    @Get('status')
    async getUserStatus(@Body('') dto: {login: string}): Promise<UserStatus> {
        return await this.usersService.getUserStatus(dto.login);
    }

    @Get('photo')
    async getUserPhoto(@Body('') dto: {login: string}): Promise<string> {
        return await this.usersService.getUserPhoto(dto.login);
    }

    @Get('username')
    async getUserUsername(@Body('') dto: {login: string}): Promise<string> {
        return await this.usersService.getUserUsername(dto.login);
    }

    @Delete(':login')
    removeBylogin(@Param('login') login: string): Promise<void> {
        return this.usersService.removeByIntraLogin(login);
    }
}
