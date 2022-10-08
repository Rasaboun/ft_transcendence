// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy, Profile } from "passport-42";
// import { createUserDto } from "src/users/dto/createUser.dto";
// import { v4 } from "uuid";
// import { AuthService } from "../auth.service";

// @Injectable()
// export class IntraStrategy extends PassportStrategy(Strategy, 'intra'){
//     constructor(
//         private readonly authService: AuthService
//     ){
//         super({
//             clientID: process.env.UID_42,
//             clientSecret: process.env.SECRET_42,
//             callbackURL: 'http://10.11.4.23:3002/auth/callback',
//             scope: ['public'],
//         })
//     }

//     async validate(accessToken: string, refreshToken: string, profile: Profile)
//     {
//         console.log("Inside validate", profile);
//         let user = await this.authService.validateUser(profile.username);
//         if (!user)
//         {
//             const dto: createUserDto = {
//                 intraLogin: profile.username,
//                 username: profile.username,
//                 photoUrl: profile.photos[0].value,
//                 roomId: v4(),
//             };
//             user =  await this.authService.signup(dto);
//         }
//         return user;
//     }
// }