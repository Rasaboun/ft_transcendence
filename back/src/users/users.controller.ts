import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Post, Put, Query, Res, StreamableFile, UploadedFile, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path'
//import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';
import { diskStorage } from 'multer'
import { User } from 'src/typeorm';
import { blockUserDto, createUserDto, updatePhotoDto, updateStatusDto, updateUsernameDto } from './dto/users.dto';
import { UserStatus } from './type/users.type';
import { UsersService } from './users.service';
import { Readable } from 'typeorm/platform/PlatformTools';
import { Observable, of } from 'rxjs';
import { join } from 'path';

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}--${randomName}${fileExtName}`);
}

//@UseGuards(AuthenticatedGuard)
//@UseFilters(AuthFilter)
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

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
