"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GameModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var auth_module_1 = require("../auth/auth.module");
var auth_service_1 = require("../auth/auth.service");
var typeorm_2 = require("../typeorm");
var users_module_1 = require("../users/users.module");
var game_gateway_1 = require("./game.gateway");
var lobby_manager_1 = require("./lobby/lobby.manager");
var GameModule = /** @class */ (function () {
    function GameModule() {
    }
    GameModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([typeorm_2.Session]),
                users_module_1.UsersModule,
                auth_module_1.AuthModule,
            ],
            providers: [lobby_manager_1.LobbyManager, game_gateway_1.GameGateway]
        })
    ], GameModule);
    return GameModule;
}());
exports.GameModule = GameModule;
