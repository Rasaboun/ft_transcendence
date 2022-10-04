import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Post, Put, Query, Res, UploadedFile, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path'
//import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';
import { diskStorage } from 'multer'
import { User } from 'src/typeorm';
import { blockUserDto, createUserDto, updatePhotoDto, updateStatusDto, updateUsernameDto } from './dto/users.dto';
import { UserStatus } from './type/users.type';
import { UsersService } from './users.service';

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
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
            })
        }))
    setUserPhoto(@UploadedFile() photo, @Body() dto: {login: string}) {
        const response = {
            originalname: photo.originalname,
            filename: photo.filename,
        }
        console.log(`Body`, dto);
        const newPhotoUrl = process.env.UPLOAD_PATH + photo.filename;
        this.usersService.setUserPhoto(dto.login, newPhotoUrl);
        return newPhotoUrl;
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
    async getUserPhoto(@Query() dto: {login: string}, @Res() res): Promise<string> {
        const photoUrl = await this.usersService.getUserPhoto(dto.login);
        console.log(`${dto.login} photo : ${photoUrl}`);
        return photoUrl;//res.sendFile(photo, {root: process.env.UPLOAD_PATH});
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
