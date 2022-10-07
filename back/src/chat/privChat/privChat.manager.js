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
exports.PrivChatManager = void 0;
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var auth_type_1 = require("../../auth/types/auth.type");
var channel_type_1 = require("../types/channel.type");
var privChat_1 = require("./privChat");
var chat_service_1 = require("./chat.service");
var typeorm_1 = require("../../typeorm");
var users_service_1 = require("../../users/users.service");
var PrivChatManager = /** @class */ (function () {
    function PrivChatManager(privChatService, userService) {
        this.privChatService = privChatService;
        this.userService = userService;
        // array of private chat or users, only thing that counts is the users online
        this.onlineChats = new Array();
    }
    PrivChatManager.prototype.initPrivChat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var privChatInDb, i, currPrivChat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.privChatService.findAll()];
                    case 1:
                        privChatInDb = _a.sent();
                        for (i = 0; privChatInDb.length; i++) {
                            currPrivChat = new privChat_1.PrivChat(this.server, privChatInDb[i].UserIdFirstSender, privChatInDb[i].UserIdFirstReciever, privChatInDb[i].mess);
                            this.onlineChats.push(currPrivChat);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PrivChatManager.prototype.privateChatExists = function (senderId, recieverId) {
        return __awaiter(this, void 0, void 0, function () {
            var e, s, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.onlineChats.forEach(function (element) {
                            if ((element._recieverId == recieverId && element._senderId == senderId) ||
                                element._senderId == recieverId && element._senderId == recieverId) {
                                return element;
                            }
                        });
                        return [4 /*yield*/, this.privChatService.findOneBySenderReciever(senderId, recieverId)];
                    case 1:
                        if ((e = _a.sent()) != undefined) {
                            console.log("return of findOneBySenderReciever : " + e);
                            s = new privChat_1.PrivChat(this.server, e.userIdFirstSender, e.userIdFirstReciever, e.mess);
                            this.onlineChats.push(s);
                            return [2 /*return*/, s];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw new common_1.ForbiddenException(error_1);
                    case 3: return [2 /*return*/, undefined];
                }
            });
        });
    };
    PrivChatManager.prototype.createPrivateChat = function (senderId, recieverId, firstMess) {
        return __awaiter(this, void 0, void 0, function () {
            var senderUser, recieverUser, messStruct, chat, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.privateChatExists(senderId, recieverId))
                            throw new common_1.ForbiddenException("Cannot create a chat that already exists");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(senderId)];
                    case 2:
                        senderUser = _a.sent();
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(recieverId)];
                    case 3:
                        recieverUser = _a.sent();
                        messStruct = {
                            "sender": { "login": senderUser.intraLogin, "username": senderUser.username },
                            "reciever": { "login": recieverUser.intraLogin, "username": recieverUser.username },
                            "content": firstMess,
                            "type": channel_type_1.MessageTypes.Message
                        };
                        this.privChatService.createNewChat({ "Sender": senderId,
                            "Reciever": recieverId, "mess": [messStruct,] });
                        chat = new privChat_1.PrivChat(this.server, senderId, recieverId, [messStruct,]);
                        this.onlineChats.push(chat);
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /*
    public terminateSocket(client: AuthenticatedSocket): void
    {
        client.data.privChat?.terminateConnection(client);
        // todo remove an element clean from an array
        var i2 = 0;
        for (var i = 0; i < this.socketList.length - 1; i++)
        {
            if (this.socketList[i] == client)
                this.socketList.at(i) == this.socketList.at(++i2);
            i2++;
        }
        this.socketList.pop()
    }
    */
    ///
    // chat operations
    ///
    PrivChatManager.prototype.loadMessages = function (senderId, recieverId) {
        return __awaiter(this, void 0, void 0, function () {
            var messageList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.privateChatExists(senderId, recieverId)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.privChatService.getMessageList(senderId, recieverId)];
                    case 1:
                        messageList = _a.sent();
                        return [2 /*return*/, (messageList)];
                    case 2: return [2 /*return*/, ([])];
                }
            });
        });
    };
    PrivChatManager.prototype.joinPrivChat = function (client, intraLogin) {
        return __awaiter(this, void 0, void 0, function () {
            var recieverId, _a, _b, _c, error_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(intraLogin)];
                    case 1:
                        recieverId = (_d.sent()).id;
                        _b = (_a = this.server.to(client.roomId)).emit;
                        _c = ["privMessageList"];
                        return [4 /*yield*/, this.loadMessages(client.login, intraLogin)];
                    case 2:
                        _b.apply(_a, _c.concat([(_d.sent()).toString()]));
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _d.sent();
                        console.log(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ///
    // message opearation
    ///
    PrivChatManager.prototype.sendMessage = function (client, senderId, recieverId, mess) {
        return __awaiter(this, void 0, void 0, function () {
            var chat, senderUser, recieverUser, messStruct;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if ((this.privateChatExists(senderId, recieverId)) == undefined) {
                            try {
                                this.createPrivateChat(senderId, recieverId, mess);
                            }
                            catch (error) {
                                throw error;
                            }
                        }
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(senderId)];
                    case 1:
                        senderUser = _a.sent();
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(recieverId)];
                    case 2:
                        recieverUser = _a.sent();
                        messStruct = {
                            "sender": { "login": senderUser.intraLogin, "username": senderUser.username },
                            "reciever": { "login": recieverUser.intraLogin, "username": recieverUser.username },
                            "content": mess,
                            "type": channel_type_1.MessageTypes.Message
                        };
                        chat.sendMessage(client.roomId, senderId, mess);
                        this.privChatService.sendMessage(messStruct);
                        return [2 /*return*/, (messStruct)];
                }
            });
        });
    };
    PrivChatManager.prototype.getOpennedPrivChat = function (clientId) {
        var ret_val = [];
        for (var i in this.onlineChats) {
            if (this.onlineChats[i]._senderId == clientId || this.onlineChats[i]._recieverId == clientId)
                ret_val.push(this.onlineChats[i]);
        }
        return (ret_val);
    };
    PrivChatManager.prototype.getConnectedUsers = function () {
        // means that we should get map or array of all connected user from the beginning on
        // means the array should constantly check for disconnection
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], PrivChatManager.prototype, "server");
    PrivChatManager = __decorate([
        __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return chat_service_1.PrivChatService; }))),
        __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return users_service_1.UsersService; })))
    ], PrivChatManager);
    return PrivChatManager;
}());
exports.PrivChatManager = PrivChatManager;
