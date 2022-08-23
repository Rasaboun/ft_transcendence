import { Controller, Get, Post, Query, Req, Redirect, Request, Res, UseGuards, ConsoleLogger, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './guards/auth.guard';
import { IntraAuthGuard } from './guards/intra.guard';
import { AuthFilter } from './utils/auth.filter';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
   
    @UseGuards(IntraAuthGuard)
    @Get('login')
    login() { 
        return ;
    } 

    @Get('redirect')
    @UseGuards(IntraAuthGuard)
    @Redirect('http://localhost:3001/')   // End of authentication, redirects to main page
    redirect(@Res() res) {   }

    @Get('status')
    @UseGuards(AuthenticatedGuard)
    @UseFilters(AuthFilter)
    status() { return 'ok'; } //returns ok if logged in

    //Example of signup page
    @Get('index')
    index() { return 'need to sign in'; }

    @Get('logout')
    logout(@Req() req) {
        console.log(req);
    }
   
}
