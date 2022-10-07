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
exports.ChatGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var auth_type_1 = require("../auth/types/auth.type");
var auth_service_1 = require("../auth/auth.service");
var common_1 = require("@nestjs/common");
var typeorm_1 = require("../typeorm");
var users_service_1 = require("../users/users.service");
var game_type_1 = require("../game/types/game.type");
var ChatGateway = /** @class */ (function () {
    function ChatGateway(channelManager, authService, privChatManager, userService) {
        this.channelManager = channelManager;
        this.authService = authService;
        this.privChatManager = privChatManager;
        this.userService = userService;
    }
    ChatGateway.prototype.afterInit = function (server) {
        this.channelManager.server = server;
        this.channelManager.initChannels();
        this.privChatManager.server = server;
    };
    ChatGateway.prototype.handleConnection = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Client ".concat(client.handshake.auth.login, " joined chat socket"));
                        return [4 /*yield*/, this.authService.initializeSocket(client)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.channelManager.joinChannels(client)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.handleDisconnect = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Client ".concat(client.login, " left server"));
                this.channelManager.terminateSocket(client);
                return [2 /*return*/];
            });
        });
    };
    ChatGateway.prototype.sendSession = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.initializeSocket(client)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.channelManager.joinChannels(client)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.joinChannel = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.joinChannel(client, data)];
                    case 1:
                        _a.sent();
                        console.log("Client ".concat(client.login, " joined channel ").concat(data.channelName));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        client.emit('error', error_1.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.leaveChannel = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.leaveChannel(client, channelName)];
                    case 1:
                        _a.sent();
                        console.log("Client ".concat(client.id, " left channel ").concat(channelName));
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        client.emit('error', error_2.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.createChannel = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.createChannel(client, data)];
                    case 1:
                        channel = _a.sent();
                        channel.addClient(client.login, client.roomId);
                        this.server.emit('activeChannels', this.channelManager.getActiveChannels());
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, client.emit('error', error_3.message)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.deleteChannel = function (client, channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.deleteChannel(channelId)];
                    case 1:
                        _a.sent();
                        console.log("Client ".concat(client.id, " deleted channel ").concat(channelId));
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        client.emit('error', error_4.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.sendMessage = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.sendMessage(data.channelId, client, data.message)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        client.emit('error', error_5.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.muteUser = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.muteUser(client, data)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        client.emit('error', error_6.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.banUser = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.banUser(client, data)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        client.emit('error', error_7.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.addAdmin = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.addAdmin(client.login, data)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        client.emit('error', error_8.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.getClientInfoOnChannel = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.sendClientInfo(client, channelName)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        client.emit('error', error_9.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.getChannelInfo = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.sendChannelInfo(client, channelName)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        client.emit('error', error_10.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.sendInvitation = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.sendInvitation(client, data)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        client.emit('error', error_11.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.getActiveChannels = function (client) {
        client.emit('activeChannels', this.channelManager.getActiveChannels());
    };
    ChatGateway.prototype.setChannelPassword = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.setChannelPassword(client.login, data)];
                    case 1:
                        _a.sent();
                        this.server.emit('activeChannels', this.channelManager.getActiveChannels());
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        client.emit('error', error_12.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.unsetChannelPassword = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.unsetChannelPassword(client.login, channelName)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        client.emit('error', error_13.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.setPrivateMode = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.setPrivateMode(client.login, channelName)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        client.emit('error', error_14.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.unsetPrivateMode = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelManager.unsetPrivateMode(client.login, channelName)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _a.sent();
                        client.emit('error', error_15.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.inviteClient = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Invited client ", data.clientId);
                        return [4 /*yield*/, this.channelManager.inviteClient(client.login, data)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _a.sent();
                        client.emit('error', error_16.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.createPrivChat = function (client, recieverId, content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.privChatManager.createPrivateChat(client.login, recieverId, content);
                }
                catch (error) {
                    client.emit('error', error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    ChatGateway.prototype.testJoinedPrivChat = function (client, intraLogin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    console.log("The login : " + intraLogin + " just connected itself to it");
                    this.privChatManager.joinPrivChat(client, intraLogin);
                }
                catch (error) {
                    client.emit('error', error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    ChatGateway.prototype.privChatLoadMessage = function (client, recieverId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    client.emit('privChatLoadMessages', this.privChatManager.loadMessages(client.login, recieverId));
                }
                catch (error) {
                    client.emit('error', error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    ChatGateway.prototype.privChatSendMessage = function (client, recieverIntraLogin, message) {
        return __awaiter(this, void 0, void 0, function () {
            var userReciever, recieverRoom, _a, _b, _c, error_17;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(recieverIntraLogin)];
                    case 1:
                        userReciever = (_d.sent());
                        recieverRoom = userReciever.roomId;
                        _b = (_a = client.to(client.roomId).to(recieverRoom)).emit;
                        _c = ['privChatSendMessage'];
                        return [4 /*yield*/, this.privChatManager.sendMessage(client, client.login, recieverIntraLogin, message)];
                    case 2:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        return [3 /*break*/, 4];
                    case 3:
                        error_17 = _d.sent();
                        client.emit('error', error_17.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.loadConnectedUsers = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var connectedList, s, e, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.findAll()];
                    case 1:
                        connectedList = _a.sent();
                        s = [];
                        connectedList.forEach(function (element) {
                            e = { intraLogin: element.intraLogin, username: element.username };
                            s.push(e);
                        });
                        client.emit('listOfConnectedUsers', s);
                        return [3 /*break*/, 3];
                    case 2:
                        error_18 = _a.sent();
                        client.emit('error', error_18.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], ChatGateway.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)("session")
    ], ChatGateway.prototype, "sendSession");
    __decorate([
        (0, websockets_1.SubscribeMessage)('joinChannel')
    ], ChatGateway.prototype, "joinChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)('leaveChannel')
    ], ChatGateway.prototype, "leaveChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)('createChannel')
    ], ChatGateway.prototype, "createChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)('deleteChannel')
    ], ChatGateway.prototype, "deleteChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)('sendMessage')
    ], ChatGateway.prototype, "sendMessage");
    __decorate([
        (0, websockets_1.SubscribeMessage)('muteUser')
    ], ChatGateway.prototype, "muteUser");
    __decorate([
        (0, websockets_1.SubscribeMessage)('banUser')
    ], ChatGateway.prototype, "banUser");
    __decorate([
        (0, websockets_1.SubscribeMessage)('addAdmin')
    ], ChatGateway.prototype, "addAdmin");
    __decorate([
        (0, websockets_1.SubscribeMessage)('clientInfo')
    ], ChatGateway.prototype, "getClientInfoOnChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)('channelInfo')
    ], ChatGateway.prototype, "getChannelInfo");
    __decorate([
        (0, websockets_1.SubscribeMessage)('sendInvitation')
    ], ChatGateway.prototype, "sendInvitation");
    __decorate([
        (0, websockets_1.SubscribeMessage)('getActiveChannels')
    ], ChatGateway.prototype, "getActiveChannels");
    __decorate([
        (0, websockets_1.SubscribeMessage)('setChannelPassword')
    ], ChatGateway.prototype, "setChannelPassword");
    __decorate([
        (0, websockets_1.SubscribeMessage)('unsetChannelPassword')
    ], ChatGateway.prototype, "unsetChannelPassword");
    __decorate([
        (0, websockets_1.SubscribeMessage)('setPrivateMode')
    ], ChatGateway.prototype, "setPrivateMode");
    __decorate([
        (0, websockets_1.SubscribeMessage)('unsetPrivateMode')
    ], ChatGateway.prototype, "unsetPrivateMode");
    __decorate([
        (0, websockets_1.SubscribeMessage)('inviteClient')
    ], ChatGateway.prototype, "inviteClient");
    __decorate([
        (0, websockets_1.SubscribeMessage)('privChatCreateChat')
    ], ChatGateway.prototype, "createPrivChat");
    __decorate([
        (0, websockets_1.SubscribeMessage)('joinPrivateChat')
    ], ChatGateway.prototype, "testJoinedPrivChat");
    __decorate([
        (0, websockets_1.SubscribeMessage)('privChatLoadMessages')
    ], ChatGateway.prototype, "privChatLoadMessage");
    __decorate([
        (0, websockets_1.SubscribeMessage)('privChatSendMessage')
    ], ChatGateway.prototype, "privChatSendMessage");
    __decorate([
        (0, websockets_1.SubscribeMessage)('loadConnectedUsers')
    ], ChatGateway.prototype, "loadConnectedUsers");
    ChatGateway = __decorate([
        (0, websockets_1.WebSocketGateway)(8002, { cors: '*', namespace: 'chat' }),
        __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return auth_service_1.AuthService; })))
    ], ChatGateway);
    return ChatGateway;
}());
exports.ChatGateway = ChatGateway;
