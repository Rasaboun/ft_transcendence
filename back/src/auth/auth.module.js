"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var axios_1 = require("@nestjs/axios");
var common_1 = require("@nestjs/common");
var jwt_1 = require("@nestjs/jwt");
var passport_1 = require("@nestjs/passport");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("../typeorm");
var users_module_1 = require("../users/users.module");
var users_service_1 = require("../users/users.service");
var auth_controller_1 = require("./auth.controller");
var auth_service_1 = require("./auth.service");
var jwt_strategy_1 = require("./stategy/jwt.strategy");
var local_strategy_1 = require("./stategy/local.strategy");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([typeorm_2.Session]),
                jwt_1.JwtModule.register({
                    secret: 'secret',
                    signOptions: { expiresIn: '600s' }
                }),
                passport_1.PassportModule,
                axios_1.HttpModule,
                users_module_1.UsersModule,
            ],
            controllers: [auth_controller_1.AuthController],
            providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy],
            exports: [auth_service_1.AuthService]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
