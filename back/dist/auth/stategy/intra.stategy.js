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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntraStrategy = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const createUser_dto_1 = require("../../users/dto/createUser.dto");
const auth_service_1 = require("../auth.service");
let IntraStrategy = class IntraStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, 'intra') {
    constructor(authService, http) {
        super({
            clientID: process.env.UID_42,
            clientSecret: process.env.SECRET_42,
            callbackURL: process.env.REDIRECT_URI_42,
        });
        this.authService = authService;
        this.http = http;
    }
    async validate(accessToken, refreshToken, profile) {
        const details = {
            intraId: profile.id,
            username: profile.username,
            photoUrl: profile.photos[0].value
        };
        return this.authService.validateUser(details);
    }
};
IntraStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        axios_1.HttpService])
], IntraStrategy);
exports.IntraStrategy = IntraStrategy;
//# sourceMappingURL=intra.stategy.js.map