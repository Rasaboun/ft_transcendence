"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.MatchController = void 0;
var common_1 = require("@nestjs/common");
//import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';
var typeorm_1 = require("../typeorm");
//@UseGuards(AuthenticatedGuard)
//@UseFilters(AuthFilter)
var MatchController = /** @class */ (function () {
    function MatchController(matchService) {
        this.matchService = matchService;
    }
    MatchController.prototype.matchResult = function (resultDto) {
        return this.matchService.matchResult(resultDto);
    };
    MatchController.prototype.findOneById = function (id) {
        return this.matchService.findOneById(id);
    };
    MatchController.prototype.getMatchsByUsername = function (username) {
        return this.matchService.getMatchesByUsername(username);
    };
    MatchController.prototype.findAll = function () {
        return this.matchService.findAll();
    };
    __decorate([
        (0, common_1.Post)('result'),
        __param(0, (0, common_1.Body)())
    ], MatchController.prototype, "matchResult");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe))
    ], MatchController.prototype, "findOneById");
    __decorate([
        (0, common_1.Get)('user/:username'),
        __param(0, (0, common_1.Param)('username'))
    ], MatchController.prototype, "getMatchsByUsername");
    __decorate([
        (0, common_1.Get)()
    ], MatchController.prototype, "findAll");
    MatchController = __decorate([
        (0, common_1.Controller)('match')
    ], MatchController);
    return MatchController;
}());
exports.MatchController = MatchController;
