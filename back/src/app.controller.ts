import { Controller, Get, Post, Request, UseFilters, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
//import { AuthenticatedGuard } from './auth/guards/auth.guard';

//@UseGuards(AuthenticatedGuard)
//@UseFilters(AuthFilter)
@Controller()
export class AppController {
  constructor(private appService: AppService) { }

  @Get('/')
  helloWorld() {
    return this.appService.getHello();
  }


}