import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/local.guard';

@Controller('chat')
export class ChatController {

    // @UseGuards(AuthenticatedGuard)
    // @Get('')
    // empty() {

    // }
}
