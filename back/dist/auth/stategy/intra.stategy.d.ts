import { HttpService } from "@nestjs/axios";
import { AuthService } from "../auth.service";
declare const IntraStrategy_base: new (...args: any[]) => any;
export declare class IntraStrategy extends IntraStrategy_base {
    private readonly authService;
    private readonly http;
    constructor(authService: AuthService, http: HttpService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
