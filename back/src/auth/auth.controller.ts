import { Controller, Get, Post, Query, Redirect, Request, Res, UseGuards, ConsoleLogger, UseFilters, Body, Req, Session } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './guards/intra.guard';
import { AuthenticatedGuard, LocalAuthGuard } from './guards/local.guard';
import { AuthFilter } from './utils/auth.filter';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
   
    //@UseGuards(IntraAuthGuard)
    // @Get('login')
    // login() { 
    //     return ;
    // } 

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){//@Body() data: {username: string, password: string}) { 
        return ;
    }

    @Post('signup')
    async signup(@Body() dto: {username: string, password: string}) {
        return await this.authService.signup(dto);
    }

    @Get('')
    async getAuthSession(@Session() session: Record<string, any>) {
        console.log(session);
        console.log(session.id);
        session.authenticated = true;
        return session;
    }

    @Get('redirect')
    //@UseGuards(IntraAuthGuard)
    @Redirect('http://localhost:3001/')   // End of authentication, redirects to main page
    redirect(@Res() res) {   }

    @UseGuards(AuthenticatedGuard)
    @Get('status')
    //@UseFilters(AuthenticatedGuard)
    status() { return 'ok'; } //returns ok if logged in

    // @Get('status')
    // //@UseGuards(AuthenticatedGuard)
    // @UseFilters(AuthFilter)
    // status() { return 'ok'; } //returns ok if logged in

    //Example of signup page
    @Get('index')
    index() { return 'need to sign in'; }

    @Get('logout')
    logout(@Req() req) {
        console.log(req);
    }
   
}
