import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
export declare class AuthFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
