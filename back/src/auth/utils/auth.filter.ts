import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(ForbiddenException)
export class AuthFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
         const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response.status(status).redirect('/auth/index'); 
    }
}