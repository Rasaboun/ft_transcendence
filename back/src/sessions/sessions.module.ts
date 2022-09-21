import { Module } from "@nestjs/common";
import { SessionService } from "./sessions.service";

@Module({
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionModule {}