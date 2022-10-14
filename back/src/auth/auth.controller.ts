import { Controller, Get, Post, Query, Redirect, Request, Res, UseGuards, ConsoleLogger, UseFilters, Body, Req, Session, UnauthorizedException, Param, Next } from '@nestjs/common';
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
import { LoginDto } from 'src/users/dto/users.dto';
import { optional } from 'joi';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
                private jwtService: JwtService,
                private userService: UsersService,) {}
   
    
    @UseGuards(JwtAuthGuard)
    @Get('logout')
    logout(@Req() req) {
        console.log(req);
    }
   

    @Get('login')
    @UseGuards(IntraGuard)
    async login()
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
            console.log('in callback');
            return ;
        }

        const cookie = await this.authService.getCookieWithJwtAccessToken(req.user.intraLogin);
  
        res.setHeader('Set-Cookie', cookie);
        res.redirect('http://localhost:3000/');

    }

    @Post('generate2fa')
    async generate(@Res() response: Response, @Body() dto: LoginDto)
    {
        const { otpauthUrl } = await this.authService.generatorTwoFactorAuthenticationSecret(dto.login);

        return this.authService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('enable2fa')
    async enable(@Body() dto: TwoFactorAuthenticationDto)
    {
        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(dto.code, dto.login);

        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');

        await this.userService.enableTwoFactorAuthentication(dto.login);
        return true;
    }

    @Post('disable2fa')
    async disable(@Body() dto: LoginDto)
    {
        await this.userService.disableTwoFactorAuthentication(dto.login);
    }

    @Post('submit2fa')
    async submit(@Body() dto: TwoFactorAuthenticationDto)
    {
        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(dto.code, dto.login);

        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');

        const jwtToken = await this.authService.getJwtToken(dto.login);
        
        return jwtToken;
    }

    @Get('navigate')
    async navigate(@Res() res)
    { 
        res.redirect('http://localhost:3000/');
    }
}
