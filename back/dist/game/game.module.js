"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const game_gateway_1 = require("./game.gateway");
const lobby_manager_1 = require("./lobby/lobby.manager");
let GameModule = class GameModule {
};
GameModule = __decorate([
    (0, common_1.Module)({
        providers: [lobby_manager_1.LobbyManager, game_gateway_1.GameGateway]
    })
], GameModule);
exports.GameModule = GameModule;
//# sourceMappingURL=game.module.js.map