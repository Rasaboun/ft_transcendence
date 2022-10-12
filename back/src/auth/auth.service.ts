import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, StreamableFile, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedSocket, TokenPayload } from 'src/auth/types/auth.type';
import { UsersService } from 'src/users/users.service';
import { v4 } from 'uuid';
import { join } from 'path';
import { createReadStream } from 'fs';
import { catchError, firstValueFrom, map } from 'rxjs';
import { UserStatus } from 'src/users/type/users.type';


@Injectable()
export class AuthService {
    constructor(
                private readonly userService: UsersService,
                private readonly jwtService: JwtService,
                private readonly httpService: HttpService,
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
        dto = {
            ...dto,
        }
        await this.userService.createUser({
                            intraLogin: dto.username,
                            roomId: v4(),
                            ...dto
                        })
        const response = await this.httpService.axiosRef({
            url: 'https://cdn.intra.42.fr/users/bditte.jpg',
            method: 'GET',
            responseType: 'arraybuffer',
        });
        const imageBuffer = Buffer.from(response.data, 'binary')
        this.userService.setUserPhoto(dto.username, imageBuffer, "default");
        return true;
    }

    async login(dto: any)
    {
        const user = await this.userService.findOneByIntraLogin(dto.username);
        const payload: TokenPayload = { 
            login: user.intraLogin,
            roomId: user.roomId,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                login: user.intraLogin,
                username: user.username,
                image: user.photo,
                roomId: user.roomId,
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
        client.chatId = await this.userService.getUserChatId(client.login);
        client.join(client.roomId);
        await this.userService.setUserStatus(client.login, UserStatus.online);
        
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
