"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChatModule = void 0;
var common_1 = require("@nestjs/common");
var chat_gateway_1 = require("./chat.gateway");
var channel_manager_1 = require("./channel/channel.manager");
var Channel_1 = require("../typeorm/Channel");
var typeorm_1 = require("@nestjs/typeorm");
var channel_service_1 = require("./channel/channel.service");
var chat_controller_1 = require("./chat.controller");
var users_service_1 = require("../users/users.service");
var typeorm_2 = require("../typeorm");
var auth_module_1 = require("../auth/auth.module");
var auth_service_1 = require("../auth/auth.service");
var users_module_1 = require("../users/users.module");
var chat_service_1 = require("./privChat/chat.service");
var privChat_1 = require("./privChat/privChat");
var privChat_manager_1 = require("./privChat/privChat.manager");
var ChatModule = /** @class */ (function () {
    function ChatModule() {
    }
    ChatModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([Channel_1.Channel, privChat_1.PrivChat]),
                typeorm_1.TypeOrmModule.forFeature([typeorm_2.User]),
                typeorm_1.TypeOrmModule.forFeature([typeorm_2.Session]),
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
            ],
            providers: [channel_service_1.ChannelsService, channel_manager_1.ChannelManager, chat_gateway_1.ChatGateway, privChat_manager_1.PrivChatManager, chat_service_1.PrivChatService],
            controllers: [chat_controller_1.ChatController]
        })
    ], ChatModule);
    return ChatModule;
}());
exports.ChatModule = ChatModule;
