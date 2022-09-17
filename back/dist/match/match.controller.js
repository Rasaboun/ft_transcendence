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
exports.MatchController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/guards/auth.guard");
const auth_filter_1 = require("../auth/utils/auth.filter");
const typeorm_1 = require("../typeorm");
const match_dto_1 = require("./dto/match.dto");
const match_service_1 = require("./match.service");
let MatchController = class MatchController {
    constructor(matchService) {
        this.matchService = matchService;
    }
    matchResult(resultDto) {
        return this.matchService.matchResult(resultDto);
    }
    findOneById(id) {
        return this.matchService.findOneById(id);
    }
    getMatchsByUsername(username) {
        return this.matchService.getMatchesByUsername(username);
    }
    findAll() {
        return this.matchService.findAll();
    }
};
__decorate([
    (0, common_1.Post)('result'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_dto_1.matchDto]),
    __metadata("design:returntype", void 0)
], MatchController.prototype, "matchResult", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Get)('user/:username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "getMatchsByUsername", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "findAll", null);
MatchController = __decorate([
    (0, common_1.Controller)('match'),
    __metadata("design:paramtypes", [match_service_1.MatchService])
], MatchController);
exports.MatchController = MatchController;
//# sourceMappingURL=match.controller.js.map