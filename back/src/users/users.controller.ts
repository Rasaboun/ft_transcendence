import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Post, Put, Query, Res, StreamableFile, UploadedFile, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/typeorm';
import { blockUserDto, createUserDto, updatePhotoDto, updateStatusDto, updateUsernameDto } from './dto/users.dto';
import { UserStatus } from './type/users.type';
import { UsersService } from './users.service';
import JwtAuthGuard from 'src/auth/guards/jwt.strategy.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

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
    @UseInterceptors(
        FileInterceptor('photo')
    )
    setUserPhoto(@UploadedFile() photo, @Body() dto: {login: string}) {
        
        this.usersService.setUserPhoto(dto.login, photo.buffer, photo.originalname);
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
    async findOneBylogin(@Query() query: {login: string}, @Res() res) {
        const user = await this.usersService.findOneByIntraLogin(query.login);
        return res.status(200).contentType('text/html').send(user);
    }

    @Get('status')
    async getUserStatus(@Query() dto: {login: string}): Promise<UserStatus> {
        return await this.usersService.getUserStatus(dto.login);
    }

    @Get('photo')
    async getUserPhoto(@Query() dto: {login: string}, @Res({ passthrough: true }) res) {
        const photo = await this.usersService.getUserPhoto(dto.login);

        res.set({
            'Content-Disposition': `inline; filename="${photo.filename}"`,
            'Content-Type': 'image/*'
        })
        return { imageBuffer: photo.data, filename: photo.filename };
    }

    @Get('username')
    async getUserUsername(@Query() dto: {login: string}): Promise<string> {
        return await this.usersService.getUserUsername(dto.login);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
