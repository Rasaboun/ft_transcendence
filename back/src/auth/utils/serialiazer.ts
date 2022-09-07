import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/typeorm";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private userService: UsersService) {
        super();
    }

    serializeUser(user: User, done: (err: Error, user: User) => void) {
        done(null, user);        
    }

    async deserializeUser(user: User, done: (err: Error, user: User) => void) {
        const userDb = await this.userService.findOneById(user.id);
        return userDb? done(null, userDb) : done(null, null);
    }
}