import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { Profile } from 'passport';
import { v4 } from 'uuid';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra') {
  constructor(private authService: AuthService) {
      super({
        clientID: process.env.UID_42,
        clientSecret: process.env.SECRET_42,
        callbackURL: 'http://localhost:3002/auth/callback',
      });
  }

  
    async validate(accessToken: string, refreshToken: string, profile: Profile)
    {
      let user = await this.authService.validateUser(profile.username);
      if (!user)
      {

        const dto: createUserDto = {
          intraLogin: profile.username,
          username: profile.username,
          photoUrl: profile.photos[0].value,
          roomId: v4()
        }
        user = await this.authService.signup(dto);
      }
      return user;
    }
}
