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
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("../typeorm");
const users_service_1 = require("../users/users.service");
const typeorm_3 = require("typeorm");
let MatchService = class MatchService {
    constructor(matchRepository, userService) {
        this.matchRepository = matchRepository;
        this.userService = userService;
    }
    findAll() {
        return this.matchRepository.find();
    }
    findOneById(id) {
        return this.matchRepository.findOneBy({ id });
    }
    getMatchesById(id) {
        return this.matchRepository.find({
            where: [
                { playerOneId: id },
                { playerTwoId: id },
            ],
        });
    }
    async getMatchesByUsername(username) {
        const user = await this.userService.findOneByUsername(username);
        if (user === null)
            throw new common_1.ForbiddenException("No such user");
        return this.getMatchesById(user.id);
    }
    async matchResult(matchDto) {
        const newMatch = this.matchRepository.create(matchDto);
        let players = { winnerId: 0, loserId: 0 };
        if (matchDto.playerOneScore > matchDto.playerTwoScore) {
            players.winnerId = matchDto.playerOneId;
            players.loserId = matchDto.playerTwoId;
        }
        else {
            players.winnerId = matchDto.playerTwoId;
            players.loserId = matchDto.playerOneId;
        }
        this.userService.updateGameStats(players);
        return this.matchRepository.save(newMatch);
    }
};
MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(typeorm_2.Match)),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        users_service_1.UsersService])
], MatchService);
exports.MatchService = MatchService;
//# sourceMappingURL=match.service.js.map