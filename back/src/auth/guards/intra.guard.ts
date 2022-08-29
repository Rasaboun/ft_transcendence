import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard('intra') {
    async canActivate(context: ExecutionContext): Promise<any> {
    /*     const activate = (await super.canActivate(context) as boolean);
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate; */
        
    }
}