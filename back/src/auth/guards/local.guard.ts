import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local')
{
    async canActivate(context: ExecutionContext) {
        const result: boolean = await super.canActivate(context) as boolean; 
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        console.log("In guard");
        const req = context.switchToHttp().getRequest();
        return req.isAuthenticated();
    }
}