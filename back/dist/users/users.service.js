"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const createUser_dto_1 = require("./dto/createUser.dto");
const typeorm_2 = require("../typeorm");
const typeorm_3 = require("typeorm");
const config_1 = require("@nestjs/config");
let UsersService = class UsersService {
    constructor(userRepository, dataSource, configService) {
        this.userRepository = userRepository;
        this.dataSource = dataSource;
        this.configService = configService;
    }
    async blockUser(idToBlock) {
        const user = this.findOneById(idToBlock);
        if (!user)
            throw new common_1.NotFoundException('User to block does not exist');
        const caller = await this.findOneById(1);
        caller.blockedUsers.push(idToBlock);
        await this.userRepository.update(caller.id, caller);
    }
    async unblockUser(idToBlock) {
        const user = this.findOneById(idToBlock);
        if (!user)
            throw new common_1.NotFoundException('User to unblock does not exist');
        const caller = await this.findOneById(1);
        const index = caller.blockedUsers.indexOf(idToBlock);
        if (index == -1)
            return;
        console.log(index);
        caller.blockedUsers.splice(index, 1);
        await this.userRepository.update(caller.id, caller);
    }
    async isBlocked(userId) {
        const caller = await this.findOneById(1);
        return caller.blockedUsers.indexOf(userId) == -1 ? false : true;
    }
    findAll() {
        return this.userRepository.find();
    }
    findOneById(id) {
        return this.userRepository.findOneBy({ id });
    }
    findOneByIntraId(id) {
        return this.userRepository.findOne({
            where: [
                { intraId: id },
            ],
        });
    }
    findOneByUsername(username) {
        if (isNaN(Number(username)))
            return this.userRepository.findOneBy({ username });
        return this.findOneById(Number(username));
    }
    async createUser(userDto) {
        while (await this.findOneByUsername(userDto.username)) {
            userDto.username += '_';
        }
        const newUser = this.userRepository.create(userDto);
        return this.userRepository.save(newUser);
    }
    async removeById(id) {
        await this.userRepository.delete(id);
    }
    async removeByUsername(username) {
        if (isNaN(Number(username)))
            await this.userRepository.delete({ username: username });
        else
            await this.userRepository.delete(username);
    }
    async updateGameStats(players) {
        const winner = await this.findOneById(players.winnerId);
        const loser = await this.findOneById(players.loserId);
        winner.victories++;
        winner.nbGames++;
        await this.userRepository.update(winner.id, winner);
        loser.defeats++;
        loser.nbGames++;
        await this.userRepository.update(loser.id, loser);
    }
    async getUserStatus(id) {
        return await (await this.findOneById(id)).status;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(typeorm_2.User)),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.DataSource,
        config_1.ConfigService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map