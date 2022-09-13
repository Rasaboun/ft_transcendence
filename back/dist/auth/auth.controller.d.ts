import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(): void;
    redirect(res: any): void;
    status(): string;
    index(): string;
    logout(req: any): void;
}
