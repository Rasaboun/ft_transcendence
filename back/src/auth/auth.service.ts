import { HttpService } from '@nestjs/axios';
import { ForbiddenException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'client-oauth2';
import { ConnectableObservable } from 'rxjs';
import { AuthenticatedSocket, newSessionDto, TokenPayload } from 'src/auth/types/auth.type';
import { Session } from 'src/typeorm/Session';
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
        const payload: TokenPayload = { 
            login: user.intraLogin,
            roomId: v4(),
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                login: user.intraLogin,
                username: user.username,
                roomId: v4(),
            }
        }
    }

    async initializeSocket(client: AuthenticatedSocket)
    {
        const session = await this.findSession(client.handshake.auth.sessionId);
        const token = client.handshake.auth.token
        console.log("auth", client.handshake.auth);
        const tokenData: TokenPayload = this.jwtService.decode(token) as TokenPayload;
        console.log("tokenData", tokenData);
        console.log("Found session", session);
        
        client.login = tokenData.login;
        client.roomId = tokenData.roomId;
        client.lobby = null;
        client.lobbyId = null; //Get in database;

        client.join(client.roomId);
        console.log("Client login", client.login)
        // if (session != null && session.expiresAt > new Date().getTime())
        // {
        //     client.sessionId = client.handshake.auth.sessionId;
        //     client.roomId = session.roomId;
        //     client.login = session.login;
        //     client.lobbyId = session.lobbyId;
        // }
        // else 
        // {
        //     console.log("handshake login", client.handshake.auth.login)
        //     client.sessionId = v4();
        //     client.roomId = v4();
        //     client.login = client.handshake.auth.login;
        //     client.lobbyId = null;
        //     client.lobby = null;
        //     await this.saveSession({
        //             sessionId: client.sessionId,
        //             roomId: client.roomId,
        //             login: client.login,
        //             lobbyId: client.lobbyId,
        //             expiresAt: new Date().getTime() + Number(process.env.COOKIE_LIFETIME_IN_MS),
        //         })
        // }

        // client.emit("session", {
        //     sessionId: client.sessionId,
        //     roomId: client.roomId,
        // })
        // console.log("Emitted session :", {
        //     sessionId: client.sessionId,
        //     roomId: client.roomId,
        // })
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

    async updateLobby(sessionId: string, lobbyId: string)
    {
        let session = await this.findSession(sessionId);
        console.log("updating session id :", sessionId)
        session.lobbyId = lobbyId;
        await this.sessionsRepository.update(session.id, session);

    }

}
