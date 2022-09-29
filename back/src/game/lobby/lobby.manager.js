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
exports.LobbyManager = void 0;
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var auth_service_1 = require("../../auth/auth.service");
var auth_type_1 = require("../../auth/types/auth.type");
var game_type_1 = require("../types/game.type");
var lobby_1 = require("./lobby");
var LobbyManager = /** @class */ (function () {
    function LobbyManager(authService) {
        this.authService = authService;
        this.lobbies = new Map();
        this.availableLobbies = [];
    }
    LobbyManager.prototype.initializeSocket = function (client) {
    };
    LobbyManager.prototype.terminateSocket = function (client) {
        var _a;
        for (var i = 0; i < this.availableLobbies.length; i++) {
            if (this.availableLobbies[i].isClient(client.login)) {
                this.availableLobbies.splice(i, 1);
                client.leave((_a = this.availableLobbies[i]) === null || _a === void 0 ? void 0 : _a.id);
            }
        }
        client.leave(client.roomId);
    };
    LobbyManager.prototype.createLobby = function (options) {
        var lobby = new lobby_1.Lobby(this.server, options, this);
        this.availableLobbies.push(lobby);
        return lobby;
    };
    LobbyManager.prototype.destroyLobby = function (lobbyId) {
        return __awaiter(this, void 0, void 0, function () {
            var lobby, _i, _a, _b, clientLogin, roomId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        lobby = this.lobbies.get(lobbyId);
                        if (!lobby)
                            return [2 /*return*/];
                        _i = 0, _a = lobby.clients;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], clientLogin = _b[0], roomId = _b[1];
                        console.log("Destroy lobby, client login :", clientLogin);
                        return [4 /*yield*/, this.authService.updateLobby(clientLogin, null)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.lobbies["delete"](lobbyId);
                        return [2 /*return*/];
                }
            });
        });
    };
    LobbyManager.prototype.joinQueue = function (client, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var lobby, i, currLobby, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lobby = null;
                        console.log("client lobby", client.lobby);
                        for (i = 0; i < this.availableLobbies.length; i++) {
                            currLobby = this.availableLobbies[i];
                            if (currLobby.isClient(client.login) === false && !currLobby.isPrivate() && currLobby.getMode() == mode) {
                                lobby = this.availableLobbies.splice(i, 1).at(0);
                                client.lobbyId = lobby.id;
                                this.lobbies.set(lobby.id, lobby);
                                break;
                            }
                        }
                        if (lobby === null) {
                            options = {
                                mode: mode,
                                inviteMode: false
                            };
                            lobby = this.createLobby(options);
                        }
                        lobby.addClient(client);
                        console.log("Client ".concat(client.login, " joined lobby ").concat(lobby.id));
                        return [4 /*yield*/, this.authService.updateLobby(client.login, lobby.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LobbyManager.prototype.leaveQueue = function (client) {
        var _a;
        for (var i = 0; i < this.availableLobbies.length; i++) {
            if (this.availableLobbies[i].isClient(client.login)) {
                this.availableLobbies.splice(i, 1);
                this.destroyLobby((_a = this.availableLobbies[i]) === null || _a === void 0 ? void 0 : _a.id);
                client.lobby = null;
                this.authService.updateLobby(client.login, null);
            }
        }
    };
    LobbyManager.prototype.joinLobby = function (lobbyId, client) {
        console.log("Spectacte lobby ".concat(lobbyId));
        var lobby = this.lobbies.get(lobbyId);
        if (!lobby)
            throw new common_1.NotFoundException("This lobby does not exist anymore");
        lobby.addClient(client);
        this.authService.updateLobby(client.login, lobby.id);
    };
    LobbyManager.prototype.joinInvitation = function (client, senderLogin) {
        var lobby = null;
        console.log("joining invitation from", senderLogin);
        for (var i = 0; i < this.availableLobbies.length; i++) {
            var currLobby = this.availableLobbies[i];
            if (currLobby.isClient(senderLogin) === true && currLobby.isPrivate()) {
                lobby = this.availableLobbies.splice(i, 1).at(0);
                client.lobbyId = lobby.id;
                if (lobby.nbPlayers == 1)
                    this.lobbies.set(lobby.id, lobby);
                this.authService.updateLobby(client.login, lobby.id);
                lobby.addClient(client);
                return true;
            }
        }
        return false;
    };
    LobbyManager.prototype.joinLobbies = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, lobbyId, lobby;
            return __generator(this, function (_c) {
                if (client.lobbyId) {
                    client.lobby = this.lobbies.get(client.lobbyId);
                }
                for (_i = 0, _a = this.lobbies; _i < _a.length; _i++) {
                    _b = _a[_i], lobbyId = _b[0], lobby = _b[1];
                    if (lobby.isClient(client.login)) {
                        client.join(lobbyId);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    LobbyManager.prototype.getLobby = function (lobbyId) {
        if (!lobbyId)
            return null;
        var resLobby = this.lobbies.get(lobbyId);
        return resLobby;
    };
    LobbyManager.prototype.getActiveLobbies = function () {
        var res = [];
        this.lobbies.forEach(function (lobby, id) {
            if (lobby.state == game_type_1.GameState.Started && lobby.nbPlayers == 2) {
                res.push({
                    lobbyId: id,
                    playersId: lobby.playersId()
                });
            }
        });
        return res;
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], LobbyManager.prototype, "server");
    LobbyManager = __decorate([
        __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return auth_service_1.AuthService; })))
    ], LobbyManager);
    return LobbyManager;
}());
exports.LobbyManager = LobbyManager;
