import { Controller, Get, Post, Query, Redirect, Request, Res, UseGuards, ConsoleLogger, UseFilters, Body, Req, Session } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
// import { IntraAuthGuard } from './guards/intra.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { LocalAuthGuard } from './guards/local-auth.guard';
// import { AuthFilter } from './utils/auth.filter';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
   

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

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req)
    {
        return this.authService.login(req.user);
    }
}
