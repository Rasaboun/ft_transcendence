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
exports.UsersController = void 0;
var common_1 = require("@nestjs/common");
//import { AuthenticatedGuard } from 'src/auth/guards/auth.guard';
var typeorm_1 = require("../typeorm");
//@UseGuards(AuthenticatedGuard)
//@UseFilters(AuthFilter)
var UsersController = /** @class */ (function () {
    function UsersController(usersService) {
        this.usersService = usersService;
    }
    UsersController.prototype.createUser = function (userDto) {
        return this.usersService.createUser(userDto);
    };
    UsersController.prototype.blockUser = function (idToBlock) {
        return this.usersService.blockUser(idToBlock);
    };
    UsersController.prototype.unblockUser = function (idToBlock) {
        return this.usersService.unblockUser(idToBlock);
    };
    UsersController.prototype.isBlocked = function (userId) {
        return this.usersService.isBlocked(userId);
    };
    UsersController.prototype.findAll = function () {
        return this.usersService.findAll();
    };
    UsersController.prototype.findOneByUsername = function (username) {
        return this.usersService.findOneByUsername(username);
    };
    UsersController.prototype.getUserStatus = function (userId) {
        return this.usersService.getUserStatus(userId);
    };
    UsersController.prototype.removeByUsername = function (username) {
        return this.usersService.removeByUsername(username);
    };
    __decorate([
        (0, common_1.Post)('create'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "createUser");
    __decorate([
        (0, common_1.Put)('block/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "blockUser");
    __decorate([
        (0, common_1.Put)('unblock/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "unblockUser");
    __decorate([
        (0, common_1.Get)('isblocked/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "isBlocked");
    __decorate([
        (0, common_1.Get)()
    ], UsersController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(':username'),
        __param(0, (0, common_1.Param)('username'))
    ], UsersController.prototype, "findOneByUsername");
    __decorate([
        (0, common_1.Get)('status/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "getUserStatus");
    __decorate([
        (0, common_1.Delete)(':username'),
        __param(0, (0, common_1.Param)('username'))
    ], UsersController.prototype, "removeByUsername");
    UsersController = __decorate([
        (0, common_1.Controller)('users')
    ], UsersController);
    return UsersController;
}());
exports.UsersController = UsersController;
