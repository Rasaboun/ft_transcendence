"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var typeorm_2 = require("./typeorm");
var users_module_1 = require("./users/users.module");
var auth_module_1 = require("./auth/auth.module");
var config_1 = require("@nestjs/config");
var passport_1 = require("@nestjs/passport");
var match_module_1 = require("./match/match.module");
var chat_module_1 = require("./chat/chat.module");
var game_module_1 = require("./game/game.module");
var AppModule = /** @class */ (function () {
    function AppModule(dataSource) {
        this.dataSource = dataSource;
    }
    AppModule.prototype.getDataSource = function () {
        return this.dataSource;
    };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true
                }),
                users_module_1.UsersModule,
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: Number(process.env.DB_PORT),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    entities: typeorm_2["default"],
                    synchronize: true
                }),
                passport_1.PassportModule.register({ session: true }),
                match_module_1.MatchModule,
                auth_module_1.AuthModule,
                chat_module_1.ChatModule,
                game_module_1.GameModule
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
            exports: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
