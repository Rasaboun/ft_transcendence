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
exports.GameGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var auth_type_1 = require("../auth/types/auth.type");
var auth_service_1 = require("../auth/auth.service");
var common_1 = require("@nestjs/common");
var GameGateway = /** @class */ (function () {
    function GameGateway(lobbyManager, authService) {
        this.lobbyManager = lobbyManager;
        this.authService = authService;
    }
    GameGateway.prototype.afterInit = function (server) {
        this.lobbyManager.server = server;
    };
    GameGateway.prototype.handleConnection = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
                        console.log("Client ".concat(client.id, " joined pong socket"));
                        return [4 /*yield*/, this.authService.initializeSocket(client)];
                    case 1:
                        _a.sent();
                        if (client.lobbyId)
                            client.lobby = this.lobbyManager.getLobby(client.lobbyId);
                        return [4 /*yield*/, this.lobbyManager.joinLobbies(client)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameGateway.prototype.handleDisconnect = function (client) {
        this.lobbyManager.terminateSocket(client);
        console.log("Client ".concat(client.id, " left pong socket"));
    };
    GameGateway.prototype.leftPong = function (client) {
        this.lobbyManager.leaveQueue(client);
    };
    GameGateway.prototype.createLobby = function (client, options) {
        return __awaiter(this, void 0, void 0, function () {
            var lobby;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lobby = this.lobbyManager.createLobby(options);
                        return [4 /*yield*/, this.authService.updateLobby(client.login, lobby.id)];
                    case 1:
                        _a.sent();
                        lobby.addClient(client);
                        client.emit("lobbyCreated", "Successful creation");
                        return [2 /*return*/];
                }
            });
        });
    };
    GameGateway.prototype.joiningQueue = function (client, mode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("client lobby before", client.lobbyId);
                        return [4 /*yield*/, this.updateLobby(client)];
                    case 1:
                        _a.sent();
                        console.log("client lobbyId after", client.lobbyId);
                        console.log("Client ".concat(client.id, " joined queue"));
                        return [4 /*yield*/, this.lobbyManager.joinQueue(client, mode)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameGateway.prototype.joinInvitation = function (client, sender) {
        try {
            if (this.lobbyManager.joinInvitation(client, sender) == false) {
                client.emit("invitationExpired", "This lobby does not exist anymore");
            }
        }
        catch (error) {
            client.emit("error", error.message);
        }
        ;
    };
    GameGateway.prototype.spectateGame = function (client, lobbyId) {
        try {
            this.lobbyManager.joinLobby(lobbyId, client);
        }
        catch (error) {
            client.emit('lobbyNotFound', error.message);
        }
    };
    GameGateway.prototype.getActiveGames = function (client) {
        client.emit('activeGames', this.lobbyManager.getActiveLobbies());
    };
    GameGateway.prototype.getGameInfo = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.updateLobby(client)];
                    case 1:
                        _a.sent();
                        if (!client.lobby)
                            return [2 /*return*/];
                        client.emit('gameData', client.lobby.getGameData());
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GameGateway.prototype.launchGame = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateLobby(client)];
                    case 1:
                        _a.sent();
                        if (!client.lobby)
                            return [2 /*return*/];
                        client.lobby.startGame();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameGateway.prototype.handlePlayerPosition = function (client, newPos) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var player;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.updateLobby(client)];
                    case 1:
                        _b.sent();
                        if (!client.lobby)
                            return [2 /*return*/];
                        player = (_a = client.lobby) === null || _a === void 0 ? void 0 : _a.getPlayer(client.login);
                        if (!player)
                            return [2 /*return*/];
                        player.pos = newPos;
                        client.join(client.roomId);
                        client.lobby.sendToUsers('updatePaddle', { playerId: client.login, newPos: newPos });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameGateway.prototype.updateLobby = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = client;
                        return [4 /*yield*/, this.authService.getUserLobbyId(client.login)];
                    case 1:
                        _a.lobbyId = _b.sent();
                        client.lobby = this.lobbyManager.getLobby(client.lobbyId);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], GameGateway.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)('leftPong')
    ], GameGateway.prototype, "leftPong");
    __decorate([
        (0, websockets_1.SubscribeMessage)('createLobby')
    ], GameGateway.prototype, "createLobby");
    __decorate([
        (0, websockets_1.SubscribeMessage)('joinedQueue')
    ], GameGateway.prototype, "joiningQueue");
    __decorate([
        (0, websockets_1.SubscribeMessage)('joinInvitation')
    ], GameGateway.prototype, "joinInvitation");
    __decorate([
        (0, websockets_1.SubscribeMessage)('spectacteGame')
    ], GameGateway.prototype, "spectateGame");
    __decorate([
        (0, websockets_1.SubscribeMessage)('getActiveGames')
    ], GameGateway.prototype, "getActiveGames");
    __decorate([
        (0, websockets_1.SubscribeMessage)('loadGame')
    ], GameGateway.prototype, "getGameInfo");
    __decorate([
        (0, websockets_1.SubscribeMessage)('startGame')
    ], GameGateway.prototype, "launchGame");
    __decorate([
        (0, websockets_1.SubscribeMessage)('playerMoved')
    ], GameGateway.prototype, "handlePlayerPosition");
    GameGateway = __decorate([
        (0, websockets_1.WebSocketGateway)(8002, { cors: '*', namespace: 'game' }),
        __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return auth_service_1.AuthService; })))
    ], GameGateway);
    return GameGateway;
}());
exports.GameGateway = GameGateway;
