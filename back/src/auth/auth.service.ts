import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedSocket, TokenPayload } from 'src/auth/types/auth.type';
import { UsersService } from 'src/users/users.service';
import { v4 } from 'uuid';


@Injectable()
export class AuthService {
    constructor(
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
        dto = {
            ...dto,
        }
        await this.userService.createUser({
                            intraLogin: dto.username,
                            roomId: v4(),
                            ...dto
                        })
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
                image: user.photoUrl,
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
