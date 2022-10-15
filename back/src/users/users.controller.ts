import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Post, Put, Query, Res, StreamableFile, UploadedFile, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/typeorm';
import { blockUserDto, createUserDto, friendDto, LoginDto, updatePhotoDto, updateStatusDto, updateUsernameDto } from './dto/users.dto';
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
    async setUserPhoto(@UploadedFile() photo, @Body() dto: LoginDto) {
        
        await this.usersService.setUserPhoto(dto.login, photo.buffer, photo.originalname);
    }

    @Put('username')
    setUserUsername(@Body() dto: updateUsernameDto) {
        return this.usersService.setUserUsername(dto.login, dto.username);
    }

    @Put('friend')
    addFriend(@Body() dto: friendDto) {
        return this.usersService.addFriend(dto.login, dto.friendLogin);
    }

    @Delete('friend')
    removeFriend(@Body() dto: friendDto) {
        return this.usersService.removeFriend(dto.login, dto.friendLogin);
    }

    @Get('isblocked')
    isBlocked(@Query() dto: blockUserDto) {
        return this.usersService.isBlocked(dto.callerLogin, dto.targetLogin);
    }


    @Get('profile')
    async findOneBylogin(@Query() dto: LoginDto, @Res() res) {
        const user = await this.usersService.findOneByIntraLogin(dto.login);
        return res.status(200).contentType('text/html').send(user);
    }

    @Get('isFriend')
    async getFriendship(@Query() query: {callerLogin: string, targetLogin: string})
    {
        return await this.usersService.isFriend(query.callerLogin, query.targetLogin);
    }

    @Get('status')
    async getUserStatus(@Query() dto: LoginDto): Promise<UserStatus> {
        return await this.usersService.getUserStatus(dto.login);
    }

    @Get('photo')
    async getUserPhoto(@Query() dto: LoginDto, @Res({ passthrough: true }) res) {
        const photo = await this.usersService.getUserPhoto(dto.login);

        res.set({
            'Content-Disposition': `inline; filename="${photo.filename}"`,
            'Content-Type': 'image/*'
        })
        return { imageBuffer: photo.data, filename: photo.filename };
    }

    @Get('username')
    async getUserUsername(@Query() dto: LoginDto): Promise<string> {
        return await this.usersService.getUserUsername(dto.login);
    }

    @Get('friendList')
    async getFriendList(@Query() dto: {login: string}) {
        return await this.usersService.getFriends(dto.login);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
