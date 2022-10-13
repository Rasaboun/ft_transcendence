import { Controller, Get, Post, Query, Redirect, Request, Res, UseGuards, ConsoleLogger, UseFilters, Body, Req, Session, UnauthorizedException, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';
import { Response } from 'express';
import { TwoFactorAuthenticationDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import JwtAuthGuard from './guards/jwt.strategy.guard';

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
        console.log("In login");
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
  
        const cookie = await this.authService.getCookieWithJwtAccessToken(req.user);
  
        res.setHeader('Set-Cookie', cookie);
        res.redirect('http://localhost:3000/');

    }

    @Post('generate2fa')
    async generate(@Res() response: Response, @Req() request: Request, @Body() dto: {callerLogin: string})
    {
        console.log("dto", dto);
        const callerLogin = dto.callerLogin; //tmp
        const { otpauthUrl } = await this.authService.generatorTwoFactorAuthenticationSecret(callerLogin);

        return this.authService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('enable2fa')
    async enable(@Req() request: Request, @Body() dto: TwoFactorAuthenticationDto)
    {
        console.log("Inside enable");
        const callerLogin = dto.login;
        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(dto.code, callerLogin);

        console.log("code valid", isCodeValid);
        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');

        await this.userService.enableTwoFactorAuthentication(callerLogin);
        return true;
    }

    @Post('disable2fa')
    async disable(@Req() request, @Body() dto: {login: string})
    {
        const callerLogin = dto.login; //tmp
        await this.userService.disableTwoFactorAuthentication(callerLogin);
    }

    @Post('submit2fa')
    async submit(@Req() req, @Body() dto: TwoFactorAuthenticationDto)
    {
        const callerLogin = dto.login;

        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(dto.code, callerLogin);

        console.log("code is valid", isCodeValid);

        if (!isCodeValid)
            return new UnauthorizedException('Wrong authentication code');
        console.log("here");
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(callerLogin); // change

        req.res.setHeader('Set-Cookie', [accessTokenCookie]);

        //redirect
        return callerLogin
    }
}
