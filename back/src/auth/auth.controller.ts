import { Controller, Get, Post, Query, Redirect, Request, Res, UseGuards, ConsoleLogger, UseFilters, Body, Req, Session, UnauthorizedException, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';
import { Response } from 'express';
import { TwoFactorAuthenticationDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import JwtAuthGuard from './guards/jwt.strategy.guard';
import { read } from 'fs';
import { TokenPayload } from './types/auth.type';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
                private jwtService: JwtService,
                private userService: UsersService) {}
   
    
    @UseGuards(JwtAuthGuard)
    @Get('logout')
    logout(@Req() req) {
        console.log(req);
    }
   

    @Post('signup')
    async signup(@Body() data)
    {
        try
        {
            return this.authService.signup(data);
        }
        catch (e){ throw e }
    }

    @Get('login')
    @UseGuards(IntraGuard)
    async login(@Request() req)
    {
    }


    @UseGuards(IntraGuard)
    @Get('callback')
    async register(@Request() req, @Res() res)
    { 
        const user = req.user;
        if (req.user == null)
        {
            res.redirect('http://localhost:3000/login');
            return ;
        }
  
        if (req.user.isTwoFactorAuthenticationEnabled)
        {
            res.cookie('login', req.user.intraLogin);   
            res.redirect('http://localhost:3000/TwofactorAuth');
            return ;
        }

        const cookie = await this.authService.getCookieWithJwtAccessToken(req.user.intraLogin);
  
        res.setHeader('Set-Cookie', cookie);
        res.redirect('http://localhost:3000/');

    }

    @Post('generate2fa')
    async generate(@Res() response: Response, @Req() request: Request, @Body() dto: {callerLogin: string})
    {
        const callerLogin = dto.callerLogin; //tmp
        const { otpauthUrl } = await this.authService.generatorTwoFactorAuthenticationSecret(callerLogin);

        return this.authService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('enable2fa')
    async enable(@Req() request: Request, @Body() dto: TwoFactorAuthenticationDto)
    {
        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(dto.code, dto.login);

        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');

        await this.userService.enableTwoFactorAuthentication(dto.login);
        return true;
    }

    @Post('disable2fa')
    async disable(@Req() request, @Body() dto: {login: string})
    {
        const callerLogin = dto.login; 
        await this.userService.disableTwoFactorAuthentication(callerLogin);
    }

    @Post('submit2fa')
    async submit(@Res() res: Response, @Request() req, @Body() dto: {login: string, code: string})
    {
        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(dto.code, dto.login);

        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');

        const cookie = await this.authService.getCookieWithJwtAccessToken(dto.login);

        res.setHeader('Set-Cookie', cookie);
        res.redirect('http://localhost:3000/');
        console.log('returning');
        return true
    }
}
