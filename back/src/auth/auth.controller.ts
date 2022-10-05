import { Controller, Get, Post, Query, Redirect, Request, Res, UseGuards, ConsoleLogger, UseFilters, Body, Req, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
// import { IntraAuthGuard } from './guards/intra.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { LocalAuthGuard } from './guards/local-auth.guard';
// import { AuthFilter } from './utils/auth.filter';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
                private jwtService: JwtService) {}
   

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
        console.log("Inside login");
    }

    @UseGuards(IntraGuard)
    @Get('callback')
    async register(@Request() req, @Res() res)
    {
        const user = req.user;
        const payload = {
            login: user.intraLogin,
            username: user.username,
            image: user.photoUrl,
            roomId: user.roomId,
        }
        console.log("Inside callback");
          
        const jwtToken = this.jwtService.sign(payload);
        //return this.authService.login(req.user);
        res.cookie('token', jwtToken);
        res.redirect('http://localhost:3000/');

    }

}
