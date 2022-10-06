import { AuthGuard } from "@nestjs/passport";

export class IntraGuard extends AuthGuard('intra') {}