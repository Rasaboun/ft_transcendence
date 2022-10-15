import { HttpService } from '@nestjs/axios';
import {  Injectable,  NotFoundException,  UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedSocket, TokenPayload } from 'src/auth/types/auth.type';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';
import { v4 } from 'uuid';
import { join } from 'path';
import { createReadStream } from 'fs';
import { catchError, firstValueFrom, map } from 'rxjs';
import { User } from 'src/typeorm';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { Long } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from 'src/users/type/users.type';


@Injectable()
export class AuthService {
    constructor(
                private readonly userService: UsersService,
                private readonly jwtService: JwtService,
                private readonly httpService: HttpService,
                private readonly configService: ConfigService,
                ) {}

    async validateUser(intraLogin: string) {
        const user = await this.userService.findOneByIntraLogin(intraLogin);

        return user;
    }

    async signup(dto: createUserDto)
    {
        if (await this.userService.findOneByIntraLogin(dto.intraLogin))
        {
            throw new UnauthorizedException("User already exists");
        }
        dto = {
            ...dto,
        }
        await this.userService.createUser(dto)
        const response = await this.httpService.axiosRef({
            url: dto.photoUrl,
            method: 'GET',
            responseType: 'arraybuffer',
        });
        const imageBuffer = Buffer.from(response.data, 'binary')
        return await this.userService.setUserPhoto(dto.intraLogin, imageBuffer, "default");    
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
                blockedUsers: user.blockedUsers,
            }
        }
    }
    
    async getCookieWithJwtAccessToken(userLogin: string)
    {
        const user = await this.userService.findOneByIntraLogin(userLogin);
        if (!user)
            return ;
        
        const payload = {
            login: user.intraLogin,
            username: user.username,
            roomId: user.roomId,
            blockedUsers: user.blockedUsers,
            twoAuthEnabled: user.isTwoFactorAuthenticationEnabled,
        }
        const token = this.jwtService.sign(payload);

        return `token=${token}; Path=/; Max-Age=${this.configService.get('JWT_LIFETIME')}s`;
    }

    async getJwtToken(userLogin: string)
    {
        const user = await this.userService.findOneByIntraLogin(userLogin);

        const payload = {
            login: user.intraLogin,
            username: user.username,
            roomId: user.roomId,
            blockedUsers: user.blockedUsers,
            twoAuthEnabled: user.isTwoFactorAuthenticationEnabled,
        }
        return this.jwtService.sign(payload);

    }

    async generatorTwoFactorAuthenticationSecret(login: string)
    {
        const user = await this.userService.findOneByIntraLogin(login);

        const secret = authenticator.generateSecret();

        const otpauthUrl = authenticator.keyuri(user.intraLogin, process.env.TWO_FACTOR_AUTHENTIATION_APP_NAME, secret);

        await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);

        return {
            secret, otpauthUrl
        }
    }

    async pipeQrCodeStream(stream: Response, otpauthUrl: string)
    {
        return toFileStream(stream, otpauthUrl);
    }

    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, login: string)
    {
        const user = await this.userService.findOneByIntraLogin(login);
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret,
        })
    }


    async initializeSocket(client: AuthenticatedSocket)
    {
        const token = client.handshake.auth.token
        const tokenData: TokenPayload = this.jwtService.decode(token) as TokenPayload;


        if (!tokenData)
            return ;
            
        const user = await this.userService.findOneByIntraLogin(tokenData.login);
        if (!user)
            throw new NotFoundException();

        client.login = tokenData.login;
        client.roomId = tokenData.roomId;
        client.lobby = null;
        client.lobbyId = user.lobbyId;
        client.chatId = user.chatId;
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
