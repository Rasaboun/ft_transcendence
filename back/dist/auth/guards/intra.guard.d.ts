import { ExecutionContext } from "@nestjs/common";
declare const IntraAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class IntraAuthGuard extends IntraAuthGuard_base {
    canActivate(context: ExecutionContext): Promise<any>;
}
export {};
