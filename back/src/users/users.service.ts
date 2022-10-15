import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Friend, initGameStats, MatchInfo, UserStatus } from './type/users.type';
import { PhotoService } from './photo/photo.service';
import { Photo } from 'src/typeorm/Photo';


@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly photoService: PhotoService,

    ) { }

    async blockUser(callerLogin: string, targetLogin: string) {
        const user = await this.findOneByIntraLogin(targetLogin);

        if (!user)
            throw new NotFoundException('User to block does not exist');
      
        const caller = await this.findOneByIntraLogin(callerLogin);
        
        if (caller.blockedUsers.indexOf(targetLogin) == -1)
        {
            caller.blockedUsers.push(targetLogin);
            await this.userRepository.update(
                caller.id,
                caller,
                )
        }
    }

    async unblockUser(callerLogin: string, targetLogin: string) {
        const user = this.findOneByIntraLogin(targetLogin);

        if (!user)
            throw new NotFoundException('User to unblock does not exist');
        
        const caller = await this.findOneByIntraLogin(callerLogin);
        
        const index = caller.blockedUsers.indexOf(targetLogin);
        if (index == -1)
            return ;
        caller.blockedUsers.splice(index, 1);
        await this.userRepository.update(
            caller.id,
            caller,
            )

    }

    async isBlocked(callerLogin: string, targetLogin: string): Promise<boolean> {
        const caller = await this.findOneByIntraLogin(callerLogin);
        
        return caller.blockedUsers.indexOf(targetLogin) == -1 ? false : true;
        
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOneById(id: number) {
        return this.userRepository.findOne({
            where: [
                { id: id},
            ],
        })
    }

    async findOneByIntraLogin(login: string) {
        if (!login)
            return ;
        return await this.userRepository.findOne({
            where: [
                { intraLogin: login},
            ],
        })
    }

    findOneByUsername(username: string){

        return this.userRepository.findOneBy({ username });
    }

    async createUser(userDto: createUserDto): Promise<User> {

    
        const newUser = this.userRepository.create(userDto);
        newUser.gameStats = initGameStats();
        return await this.userRepository.save(newUser);
    }
    
    async removeByIntraLogin(login: string): Promise<void> {
        const user = await this.findOneByIntraLogin(login);
        await this.userRepository.delete(user.id);
    }

    async removeByUsername(username: string): Promise<void> {
        if (isNaN(Number(username)))
            await this.userRepository.delete({username: username});
        else
            await this.userRepository.delete(username);
    }

    async updateGameStats(matchInfo: MatchInfo)
    {
        const winner = await this.findOneByIntraLogin(matchInfo.winnerLogin);
        const loser = await this.findOneByIntraLogin(matchInfo.loserLogin);

        winner.gameStats.victories++;
        winner.gameStats.nbGames++;
        winner.gameStats.goalsScored += matchInfo.winnerScore;
        winner.gameStats.goalsTaken += matchInfo.loserScore;
        if (winner.status == UserStatus.ingame)
            winner.status = UserStatus.online;
        await this.userRepository.update(
            winner.id,
            winner
        );

        loser.gameStats.defeats++;
        loser.gameStats.nbGames++;
        loser.gameStats.goalsScored += matchInfo.loserScore;
        loser.gameStats.goalsTaken += matchInfo.winnerScore;
        if (loser.status == UserStatus.ingame)
            loser.status = UserStatus.online;
        await this.userRepository.update(
            loser.id,
            loser
        );
    }

    async setTwoFactorAuthenticationSecret(secret: string, userId: number)
    {
        await this.userRepository.update(userId, {twoFactorAuthenticationSecret: secret});
    }

    async enableTwoFactorAuthentication(login: string)
    {
        const user = await this.findOneByIntraLogin(login);

        user.isTwoFactorAuthenticationEnabled = true;
        await this.userRepository.update(user.id, user);
    }

    async disableTwoFactorAuthentication(login: string)
    {
        const user = await this.findOneByIntraLogin(login);

        user.isTwoFactorAuthenticationEnabled = false;
        await this.userRepository.update(user.id, user);
    }

    async setUserStatus(login: string, status: UserStatus)
    {
        if (!login)
            return ;
        const user = await this.findOneByIntraLogin(login);
        if (!user)
            return ;
        user.status = status;
        await this.userRepository.update(user.id, user);
    }

    async getUserStatus(login: string): Promise<UserStatus> {

        const user = await this.findOneByIntraLogin(login);
        return user.status;
    }

    async setUserPhoto(login: string, imageBuffer: Buffer, filename: string)
    {
        const user = await this.findOneByIntraLogin(login);
        
        if (!user)
            return ;

        const photo = await this.photoService.addPhoto(imageBuffer, filename);
        user.photoId = photo.id;
        await this.userRepository.update(user.id, user);
        return user
    }

    async getUserPhoto(login: string): Promise<Photo> {

        const user = await this.findOneByIntraLogin(login);
        return await this.photoService.getPhotoById(user.photoId);
    }

    async setUserUsername(login: string, newUsername: string)
    {
        const user = await this.findOneByIntraLogin(login);
        if (!user)
            return ;
        const targetUser = await this.findOneByUsername(newUsername);
        if (targetUser)
            throw new ForbiddenException("Username already taken");
        user.username = newUsername;
        await this.userRepository.update(user.id, user);
    }

    async addFriend(login: string, newFriendLogin: string)
    {
        const user = await this.findOneByIntraLogin(login);
        if (!user)
            return ;
        user.friendList.push(newFriendLogin);
        await this.userRepository.update(user.id, user);

    }

    async removeFriend(login: string, friendLogin: string)
    {
        const user = await this.findOneByIntraLogin(login);
        if (!user)
            return ;
        const index = user.friendList.indexOf(friendLogin);
        if (index == -1)
            return ;
        user.friendList.splice(index, 1);
        await this.userRepository.update(user.id, user);
        return await this.getFriends(login);

    }

    async isFriend(callerLogin: string, targetLogin: string)
    {
        const caller = await this.findOneByIntraLogin(callerLogin);
        return caller.friendList.indexOf(targetLogin) == -1 ? false : true;
    }

    async getUserUsername(login: string): Promise<string> {

        const user = await this.findOneByIntraLogin(login);
        return user.username;
    }

    async getUserLobby(login: string)
    {
        const user = await this.findOneByIntraLogin(login);
        return user.lobbyId;
    }

    async setUserLobby(login: string, newLobby: string | null)
    {
        const user = await this.findOneByIntraLogin(login);
        user.lobbyId = newLobby;
        await this.userRepository.update(user.id, user);
    }

    async getUserChatId(login: string)
    {
        const user = await this.findOneByIntraLogin(login);
        return user.chatId;
    }

    async setUserChatId(login: string, newChat: string | null)
    {
        const user = await this.findOneByIntraLogin(login);
        user.chatId = newChat;
        await this.userRepository.update(user.id, user);
    }
    

    async getUserRoomId(login: string)
    {
        const user = await this.findOneByIntraLogin(login);
        return user.roomId;
    }

    async getFriends(login: string)
    {
        const user = await this.findOneByIntraLogin(login);
        if (!user)
            return ;
        let friends: Friend[] = [];
        
        for(const friendLogin of user.friendList)
        {
            const friend = await this.findOneByIntraLogin(friendLogin);
            friends.push({
                login: friend.intraLogin,
                username: friend.username,
                status: friend.status,
            })
        }
        return friends;
    }
}
