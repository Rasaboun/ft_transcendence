import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedSocket, TokenPayload } from 'src/auth/types/auth.type';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { v4 } from 'uuid';


@Injectable()
export class AuthService {
    constructor(
                private readonly userService: UsersService,
                private readonly jwtService: JwtService,
                ) {}

    async validateUser(intraLogin: string) {
        const user = await this.userService.findOneByIntraLogin(intraLogin);

        return user;
    }

    async signup(dto: createUserDto) {

        return await this.userService.createUser(dto);
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
                image: user.photoUrl,
                roomId: user.roomId,
            }
        }
    }

    async initializeSocket(client: AuthenticatedSocket)
    {
        const token = client.handshake.auth.token
        const tokenData: TokenPayload = this.jwtService.decode(token) as TokenPayload;

        if (!tokenData)
            return ;
        client.login = tokenData.login;
        client.roomId = tokenData.roomId;
        client.lobby = null;
        client.lobbyId = await this.userService.getUserLobby(client.login);
        client.join(client.roomId);
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
