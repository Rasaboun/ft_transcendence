"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MatchModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("../typeorm");
var users_module_1 = require("../users/users.module");
var match_controller_1 = require("./match.controller");
var match_service_1 = require("./match.service");
var MatchModule = /** @class */ (function () {
    function MatchModule() {
    }
    MatchModule = __decorate([
        (0, common_1.Module)({
            imports: [
                users_module_1.UsersModule,
                typeorm_1.TypeOrmModule.forFeature([typeorm_2.Match])
            ],
            controllers: [match_controller_1.MatchController],
            providers: [match_service_1.MatchService]
        })
    ], MatchModule);
    return MatchModule;
}());
exports.MatchModule = MatchModule;
