import { Controller, Get, Post, Query, Redirect, Request, Res, UseGuards, ConsoleLogger, UseFilters, Body, Req, Session, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';
import { Response } from 'express';
import { TwoFactorAuthenticationDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import bodyParser from 'body-parser';
// import { IntraAuthGuard } from './guards/intra.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { LocalAuthGuard } from './guards/local-auth.guard';
// import { AuthFilter } from './utils/auth.filter';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
                private jwtService: JwtService,
                private userService: UsersService) {}
   

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
        // const payload = {
        //     login: user.intraLogin,
        //     username: user.username,
        //     image: user.photoUrl,
        //     twoAuthEnabled: user.isTwoFactorAuthenticationEnabled,
        // }
  
        const cookie = await this.authService.getCookieWithJwtAccessToken(req.user);
        console.log("cookie", cookie);
        console.log("Inside callback");
          
        //const jwtToken = this.jwtService.sign(payload);

        //res.cookie('token', jwtToken);

        //return this.authService.login(req.user);
        res.setHeader('Set-Cookie', cookie);
        res.redirect('http://localhost:3000/');

    }

    @Post('generate2fa')
    async generate(@Res() response: Response, @Req() request: Request, @Body() dto: {login: string})
    {
        const callerLogin = "bditte"; //tmp
        const { otpauthUrl } = await this.authService.generatorTwoFactorAuthenticationSecret(callerLogin);

        return this.authService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('enable2fa')
    async enable(@Req() request: Request, @Body() dto: TwoFactorAuthenticationDto)
    {
        const callerLogin = "bditte"; //tmp
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(dto.twoFactorAuthenticationCode, callerLogin);

        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');

        await this.userService.enableTwoFactorAuthentication(callerLogin);
    }

    @Post('disable2fa')
    async disable(@Req() request, @Body() dto: {login: string})
    {
        const callerLogin = "bditte"; //tmp
        await this.userService.disableTwoFactorAuthentication(callerLogin);
    }

    @Post('submit2fa')
    async submit(@Req() req, @Body() dto: TwoFactorAuthenticationDto)
    {
        const callerLogin = "kamanfo"; //tmp
        console.log("user");
        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(dto.twoFactorAuthenticationCode, callerLogin);

        console.log("code is valid", isCodeValid);

        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');
        console.log("here");
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(callerLogin); // change

        req.res.setHeader('Set-Cookie', [accessTokenCookie]);

        return callerLogin
    }
}
