import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
//import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';

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
    isBlocked(@Query() dto: blockUserDto) {
        return this.usersService.isBlocked(dto.callerLogin, dto.targetLogin);
    }


    @Get('profile')
    async findOneBylogin(@Query() query: {login: string}) {
        return await this.usersService.findOneByIntraLogin(query.login);
    }

    @Get('status')
    async getUserStatus(@Query() dto: {login: string}): Promise<UserStatus> {
        return await this.usersService.getUserStatus(dto.login);
    }

    @Get('photo')
    async getUserPhoto(@Query() dto: {login: string}): Promise<string> {
        return await this.usersService.getUserPhoto(dto.login);
    }

    @Get('username')
    async getUserUsername(@Query() dto: {login: string}): Promise<string> {
        return await this.usersService.getUserUsername(dto.login);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
