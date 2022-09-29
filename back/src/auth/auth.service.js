"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var auth_type_1 = require("./types/auth.type");
var Session_1 = require("../typeorm/Session");
var createUser_dto_1 = require("../users/dto/createUser.dto");
var users_service_1 = require("../users/users.service");
var uuid_1 = require("uuid");
var AuthService = /** @class */ (function () {
    function AuthService(sessionsRepository, userService, jwtService) {
        this.sessionsRepository = sessionsRepository;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    AuthService.prototype.validateUser = function (details) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.findOneByIntraLogin(details.intraLogin)];
                    case 1:
                        user = _a.sent();
                        if (user && user.password == details.password) {
                            return [2 /*return*/, user];
                        }
                        return [2 /*return*/, (null)];
                }
            });
        });
    };
    AuthService.prototype.signup = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.findOneByIntraLogin(dto.username)];
                    case 1:
                        if (_a.sent()) {
                            throw new common_1.UnauthorizedException("User already exists");
                        }
                        dto = __assign({}, dto);
                        return [4 /*yield*/, this.userService.createUser(__assign({ intraLogin: dto.username, roomId: (0, uuid_1.v4)() }, dto))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    AuthService.prototype.login = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.findOneByIntraLogin(dto.username)];
                    case 1:
                        user = _a.sent();
                        payload = {
                            login: user.intraLogin,
                            roomId: user.roomId
                        };
                        return [2 /*return*/, {
                                access_token: this.jwtService.sign(payload),
                                user: {
                                    login: user.intraLogin,
                                    username: user.username,
                                    roomId: user.roomId
                                }
                            }];
                }
            });
        });
    };
    AuthService.prototype.initializeSocket = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var token, tokenData, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        token = client.handshake.auth.token;
                        tokenData = this.jwtService.decode(token);
                        client.login = tokenData.login;
                        client.roomId = tokenData.roomId;
                        client.lobby = null;
                        _a = client;
                        return [4 /*yield*/, this.userService.getUserLobby(client.login)];
                    case 1:
                        _a.lobbyId = _b.sent();
                        client.join(client.roomId);
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.findSession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sessionId)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.sessionsRepository.findOne({
                                where: { sessionId: sessionId }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthService.prototype.saveSession = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var newSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newSession = this.sessionsRepository.create(dto);
                        return [4 /*yield*/, this.sessionsRepository.save(newSession)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.updateLobby = function (login, lobbyId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.setUserLobby(login, lobbyId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.getUserLobbyId = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.findOneByIntraLogin(login)];
                    case 1: return [2 /*return*/, (_a.sent()).lobbyId];
                }
            });
        });
    };
    AuthService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(Session_1.Session))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
