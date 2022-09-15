import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
//     async canActivate(context: ExecutionContext): Promise<any> {
//          const req = context.switchToHttp().getRequest();
//         if (req.isAuthenticated() == false)
//             throw new ForbiddenException('Not logged in'); // Send to filter that will redirect
//         return req.isAuthenticated(); 
//     }
// }