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
        const token = client.handshake.auth.token
        const tokenData: TokenPayload = this.jwtService.decode(token) as TokenPayload;

        
        client.login = tokenData.login;
        client.roomId = tokenData.roomId;
        client.lobby = null;
        client.lobbyId = await this.userService.getUserLobby(client.login);
        client.join(client.roomId);
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

    async updateLobby(login: string, lobbyId: string | null)
    {
        await this.userService.setUserLobby(login, lobbyId);
    }

    async getUserLobbyId(login: string)
    {
        return (await this.userService.findOneByIntraLogin(login)).lobbyId;
    }
}
