import { HttpService } from '@nestjs/axios';
import { ForbiddenException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'client-oauth2';
import { AuthenticatedSocket, newSessionDto } from 'src/auth/types/auth.type';
import { Session, User } from 'src/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';


@Injectable()
export class AuthService {
    constructor(
                @InjectRepository(Session)
                private readonly sessionsRepository: Repository<Session>,
                private readonly userService: UsersService,
                private readonly jwtService: JwtService,
                ) {}

    async validateUser(details) {
        const user = await this.userService.findOneByIntraLogin(details.intraLogin);

        if (user && user.password == details.password)
        {
            return user
        }
        return (null);
    }

    async signup(dto: {username: string, password: string}) {
        if (await this.userService.findOneByIntraLogin(dto.username))
        {
            throw new UnauthorizedException("User already exists");
        }
        await this.userService.createUser({intraLogin: dto.username, ...dto})
        return true;
    }

    async login(dto: any)
    {
        const user = await this.userService.findOneByIntraLogin(dto.username);
        const payload = { username: dto.username, password: dto.password};
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                login: user.intraLogin,
                username: user.username,
            }
        }
    }

    async initializeSocket(client: AuthenticatedSocket)
    {
        const session = await this.findSession(client.handshake.auth.sessionId);
        console.log(client.handshake.auth);
        console.log("findSession", session);
        if (session && session.expiresAt > new Date().getTime())
        {
            client.sessionId = client.handshake.auth.sessionId;
            client.roomId = session.roomId;
            client.login = session.login;
            client.lobbyId = session.lobbyId;
        }
        else 
        {
            client.sessionId = v4();
            client.roomId = v4();
            client.login = client.handshake.auth.login;
            client.lobbyId = null;
            client.lobby = null;
            this.saveSession({
                    sessionId: client.sessionId,
                    roomId: client.roomId,
                    login: client.login,
                    lobbyId: client.lobbyId,
                    expiresAt: new Date().getTime() + Number(process.env.COOKIE_LIFETIME_IN_MS),
                })
        }
        client.join(client.roomId);
        console.log("Session", {
            sessionId: client.sessionId,
            roomId: client.roomId,
        })
        client.emit("session", {
            sessionId: client.sessionId,
            roomId: client.roomId,
        })

    }

    async findSession(sessionId: string)
    {
        if (!sessionId)
            return null;
        return await this.sessionsRepository.findOne({
            where: 
                { sessionId: sessionId},     
        })
    }

    async saveSession(dto: newSessionDto)
    {
        const newSession = this.sessionsRepository.create(dto);
        await this.sessionsRepository.save(newSession);
    }

}
