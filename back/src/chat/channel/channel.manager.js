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
exports.ChannelManager = void 0;
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var auth_type_1 = require("../../auth/types/auth.type");
var game_type_1 = require("../../game/types/game.type");
var users_service_1 = require("../../users/users.service");
var channel_type_1 = require("../types/channel.type");
var channel_1 = require("./channel");
var channel_service_1 = require("./channel.service");
var ChannelManager = /** @class */ (function () {
    function ChannelManager(channelsService, userService) {
        this.channelsService = channelsService;
        this.userService = userService;
        this.channels = new Map();
    }
    ChannelManager.prototype.initChannels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var channelsInDb, i, currChannel, clientIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelsService.findAll()];
                    case 1:
                        channelsInDb = _a.sent();
                        for (i = 0; i < channelsInDb.length; i++) {
                            currChannel = new channel_1.Channel(this.server, channelsInDb[i].name);
                            for (clientIndex = 0; clientIndex < channelsInDb[i].clients.length; clientIndex++) {
                                currChannel.addClient(channelsInDb[i].clients[clientIndex].id, null);
                            }
                            this.channels.set(channelsInDb[i].name, currChannel);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.initializeSocket = function (client) {
    };
    ChannelManager.prototype.terminateSocket = function (client) {
    };
    ChannelManager.prototype.createChannel = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, _a, _b, _c, _d, _e, error_1;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 5, , 6]);
                        if (this.channels.get(data.name) != undefined)
                            throw new common_1.ForbiddenException("This channel name is already taken");
                        if (channel_type_1.uuidRegexExp.test(data.name))
                            throw new common_1.ForbiddenException("Invalid channel name");
                        channel = new channel_1.Channel(this.server, data.name);
                        channel.owner = client.login;
                        channel.mode = data.mode;
                        channel.addClient(client.login, client.roomId);
                        if (data.mode != channel_type_1.ChannelModes.Password)
                            data.password = "";
                        this.channels.set(channel.id, channel);
                        return [4 /*yield*/, this.channelsService.createChannel(//change to just the name
                            {
                                name: data.name,
                                mode: data.mode,
                                password: data.password,
                                ownerId: client.login
                            })];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, this.channelsService.addClient(channel.id, client.login, data.password)];
                    case 2:
                        _g.sent(); //change to real id
                        return [4 /*yield*/, this.channelsService.addAdmin(channel.id, client.login)];
                    case 3:
                        _g.sent(); //change to real id
                        client.join(channel.id);
                        _b = (_a = channel).sendToUsers;
                        _c = ["joinedChannel"];
                        _f = { clientId: client.login };
                        _e = (_d = channel).getInfo;
                        return [4 /*yield*/, this.getChannelClients(channel.id)];
                    case 4:
                        _b.apply(_a, _c.concat([(_f.channelInfo = _e.apply(_d, [_g.sent()]), _f)]));
                        return [2 /*return*/, channel];
                    case 5:
                        error_1 = _g.sent();
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.joinChannel = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, mutedList, user_1, timeBanned, _a, _b, _c, _d, _e, _f, user, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, error_2;
            var _s, _t, _u;
            return __generator(this, function (_v) {
                switch (_v.label) {
                    case 0:
                        _v.trys.push([0, 16, , 17]);
                        channel = this.channels.get(data.channelName);
                        return [4 /*yield*/, this.channelsService.findOneById(data.channelName)];
                    case 1: return [4 /*yield*/, (_v.sent()).mutedList];
                    case 2:
                        mutedList = _v.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist anymore");
                        return [4 /*yield*/, this.channelsService.isBanned(data.channelName, client.login)];
                    case 3:
                        if (!((_v.sent()) == true)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.channelsService.getClientById(data.channelName, client.login)];
                    case 4:
                        user_1 = _v.sent();
                        timeBanned = (user_1.unbanDate - new Date().getTime()) / 1000;
                        throw new common_1.ForbiddenException("You are banned from this channel for ".concat(Math.trunc(timeBanned), " seconds"));
                    case 5: return [4 /*yield*/, this.channelsService.isClient(channel.id, client.login)];
                    case 6:
                        if (!(_v.sent())) return [3 /*break*/, 8];
                        client.join(channel.id);
                        _b = (_a = client).emit;
                        _c = ["joinedChannel"];
                        _s = { clientId: client.login };
                        _e = (_d = channel).getInfo;
                        return [4 /*yield*/, this.getChannelClients(channel.id)];
                    case 7:
                        _b.apply(_a, _c.concat([(_s.channelInfo = _e.apply(_d, [_v.sent()]), _s)]));
                        //channel.sendToClient(client.login, "joinedChannel", {clientId: client.login, channelInfo: channel.getInfo(await this.getChannelClients(channel.id))});
                        return [2 /*return*/];
                    case 8:
                        _f = channel.isPrivate();
                        if (!_f) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.channelsService.isInvited(data.channelName, client.login)];
                    case 9:
                        _f = !(_v.sent());
                        _v.label = 10;
                    case 10:
                        if (_f)
                            throw new common_1.ForbiddenException("You are not invited to this channel");
                        return [4 /*yield*/, this.channelsService.addClient(data.channelName, client.login, data.password)]; //change to real id
                    case 11:
                        _v.sent(); //change to real id
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(client.login)];
                    case 12:
                        user = _v.sent();
                        return [4 /*yield*/, this.sendInfoMessage(client, channel.id, "".concat(user.username, " joined the channel"))];
                    case 13:
                        _v.sent();
                        channel.addClient(client.login, client.roomId);
                        client.join(channel.id);
                        _h = (_g = client).emit;
                        _j = ["joinedChannel"];
                        _t = { clientId: client.login };
                        _l = (_k = channel).getInfo;
                        return [4 /*yield*/, this.getChannelClients(channel.id)];
                    case 14:
                        _h.apply(_g, _j.concat([(_t.channelInfo = _l.apply(_k, [_v.sent()]), _t)]));
                        _o = (_m = channel).sendToUsers;
                        _p = ["joinedChannel"];
                        _u = { clientId: client.login };
                        _r = (_q = channel).getInfo;
                        return [4 /*yield*/, this.getChannelClients(channel.id)];
                    case 15:
                        _o.apply(_m, _p.concat([(_u.channelInfo = _r.apply(_q, [_v.sent()]), _u), client.roomId]));
                        return [3 /*break*/, 17];
                    case 16:
                        error_2 = _v.sent();
                        throw error_2;
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.joinChannels = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, channelName, channel;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, _a = this.channels;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], channelName = _b[0], channel = _b[1];
                        return [4 /*yield*/, this.channelsService.isClient(channelName, client.login)];
                    case 2:
                        if ((_c.sent())) {
                            client.join(channelName);
                            this.channels.get(channelName).updateClient(client.login, client.roomId);
                        }
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.leaveChannel = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, user, _a, _b, _c, _d, _e, newOwnerUsername_1, _f, _g, _h, _j, _k, error_3;
            var _l;
            var _this = this;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        _m.trys.push([0, 9, , 10]);
                        channel = this.channels.get(channelName);
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist anymore");
                        return [4 /*yield*/, this.channelsService.removeClient(channelName, client.login)];
                    case 1:
                        _m.sent();
                        channel.removeClient(client.login);
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(client.login)];
                    case 2:
                        user = _m.sent();
                        return [4 /*yield*/, this.sendInfoMessage(client, channel.id, "".concat(user.username, " left the channel"))];
                    case 3:
                        _m.sent();
                        _b = (_a = channel).sendToUsers;
                        _c = ["leftChannel"];
                        _e = (_d = channel).getInfo;
                        return [4 /*yield*/, this.getChannelClients(channel.id)];
                    case 4:
                        _b.apply(_a, _c.concat([_e.apply(_d, [_m.sent()])]));
                        if (!(channel.getNbClients() == 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.deleteChannel(channelName)];
                    case 5:
                        _m.sent();
                        //this.channels.delete(channelName);
                        //await this.channelsService.deleteChannel(channelName);
                        return [2 /*return*/];
                    case 6:
                        if (channel.owner != client.login)
                            return [2 /*return*/];
                        newOwnerUsername_1 = null;
                        channel.clients.forEach(function (roomId, id) {
                            if (_this.channelsService.isAdmin(channelName, id) && id != client.login) {
                                newOwnerUsername_1 = id;
                            }
                        });
                        if (newOwnerUsername_1 == null) {
                            channel.clients.forEach(function (roomId, id) {
                                if (id != client.login) {
                                    newOwnerUsername_1 = id;
                                }
                            });
                        }
                        channel.owner = newOwnerUsername_1;
                        //add new owner in admin
                        return [4 /*yield*/, this.channelsService.setNewOwner(channelName, newOwnerUsername_1)];
                    case 7:
                        //add new owner in admin
                        _m.sent();
                        _g = (_f = channel).sendToUsers;
                        _h = ["newOwner"];
                        _l = { target: newOwnerUsername_1 };
                        _k = (_j = channel).getInfo;
                        return [4 /*yield*/, this.getChannelClients(channel.id)];
                    case 8:
                        _g.apply(_f, _h.concat([(_l.channelInfo = _k.apply(_j, [_m.sent()]), _l)]));
                        return [3 /*break*/, 10];
                    case 9:
                        error_3 = _m.sent();
                        throw error_3;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.deleteChannel = function (channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, clientsSockets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        channel = this.channels.get(channelId);
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        return [4 /*yield*/, channel.sendToUsers("channelDeleted", "Channel has been destroyed")];
                    case 1:
                        _a.sent();
                        this.channels["delete"](channelId);
                        this.channelsService.deleteChannel(channelId);
                        return [4 /*yield*/, this.server["in"](channelId).fetchSockets()];
                    case 2:
                        clientsSockets = _a.sent();
                        console.log("Channel got deleted with ".concat(clientsSockets.length, " clients"));
                        clientsSockets.forEach(function (socket) {
                            socket.leave(channelId);
                        });
                        this.server.emit('activeChannels', this.getActiveChannels());
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.sendMessage = function (channelId, client, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, mutedTimeRemaining, user, message, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        channel = this.channels.get(channelId);
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        return [4 /*yield*/, this.channelsService.isMuted(channelId, client.login)];
                    case 1:
                        if (!((_a.sent()) == true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.channelsService.getClientById(channelId, client.login)];
                    case 2:
                        mutedTimeRemaining = (_a.sent()).unmuteDate - new Date().getTime() / 1000;
                        throw new channel_type_1.MutedException("You are muted on this channel", mutedTimeRemaining);
                    case 3: return [4 /*yield*/, this.userService.findOneByIntraLogin(client.login)];
                    case 4:
                        user = _a.sent();
                        message = {
                            sender: {
                                login: user.intraLogin,
                                username: user.username
                            },
                            channelName: channelId,
                            content: msg,
                            date: new Date().toString(),
                            type: channel_type_1.MessageTypes.Message
                        };
                        channel.sendMessage(message);
                        return [4 /*yield*/, this.channelsService.addMessage(channelId, message)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_4 = _a.sent();
                        throw error_4;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.sendInfoMessage = function (client, channelId, content) {
        return __awaiter(this, void 0, void 0, function () {
            var message, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        message = {
                            sender: {
                                login: client.login,
                                username: client.login
                            },
                            channelName: channelId,
                            date: new Date().toString(),
                            content: content,
                            type: channel_type_1.MessageTypes.Info
                        };
                        this.channels.get(channelId).sendMessage(message);
                        return [4 /*yield*/, this.channelsService.addMessage(channelId, message)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.createAndSaveInfoMessage = function (client, channelId, content) {
        return __awaiter(this, void 0, void 0, function () {
            var message, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        message = {
                            sender: {
                                login: client.login,
                                username: client.login
                            },
                            channelName: channelId,
                            date: new Date().toString(),
                            content: content,
                            type: channel_type_1.MessageTypes.Info
                        };
                        return [4 /*yield*/, this.channelsService.addMessage(channelId, message)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.muteUser = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var caller, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.channelsService.getClientById(data.channelName, client.login)];
                    case 1:
                        caller = _a.sent();
                        if (caller == undefined || caller.isAdmin == false || this.channels.get(data.channelName).owner == data.targetId)
                            throw new common_1.ForbiddenException("You are not allowed to do this");
                        return [4 /*yield*/, this.channelsService.muteClient(data)];
                    case 2:
                        _a.sent();
                        this.createAndSaveInfoMessage(client, data.channelName, "".concat(data.targetId, " has been muted for ").concat(data.duration, " secs"));
                        this.channels.get(data.channelName).sendToUsers("mutedInChannel", data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.banUser = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var caller, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.channelsService.getClientById(data.channelName, client.login)];
                    case 1:
                        caller = _a.sent();
                        if (caller == undefined || caller.isAdmin == false || this.channels.get(data.channelName).owner == data.targetId)
                            throw new common_1.ForbiddenException("You are not allowed to do this");
                        return [4 /*yield*/, this.channelsService.banClient(data)];
                    case 2:
                        _a.sent();
                        this.createAndSaveInfoMessage(client, data.channelName, "".concat(data.targetId, " has been banned for ").concat(data.duration, " secs"));
                        this.channels.get(data.channelName).sendToUsers("bannedFromChannel", data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.addAdmin = function (clientId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, _a, _b, _c, _d, _e, error_9;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        channel = this.channels.get(data.channelName);
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 5, , 6]);
                        if (!this.channelsService.isAdmin(data.channelName, clientId) || data.clientId == channel.owner)
                            throw new common_1.ForbiddenException("You are not allowed to do this");
                        return [4 /*yield*/, this.channelsService.isAdmin(data.channelName, data.clientId)];
                    case 2:
                        if (_g.sent()) {
                            channel.sendToClient(clientId, "isAlreadyAdmin");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.channelsService.addAdmin(data.channelName, data.clientId)];
                    case 3:
                        _g.sent();
                        _b = (_a = channel).sendToUsers;
                        _c = ["addAdmin"];
                        _f = { target: data.clientId };
                        _e = (_d = channel).getInfo;
                        return [4 /*yield*/, this.getChannelClients(channel.id)];
                    case 4:
                        _b.apply(_a, _c.concat([(_f.channelInfo = _e.apply(_d, [_g.sent()]), _f)]));
                        return [3 /*break*/, 6];
                    case 5:
                        error_9 = _g.sent();
                        throw error_9;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.inviteClient = function (clientId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var caller, target, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.channelsService.getClientById(data.channelName, clientId)];
                    case 1:
                        caller = _a.sent();
                        if (caller == undefined || caller.isAdmin == false)
                            throw new common_1.ForbiddenException("You are not allowed to do this");
                        return [4 /*yield*/, this.userService.findOneByUsername(data.clientId)];
                    case 2:
                        target = _a.sent();
                        if (!target)
                            throw new common_1.NotFoundException("This user does not exist");
                        data.clientId = target.intraLogin;
                        // Send notification ?
                        return [4 /*yield*/, this.channelsService.inviteClient(data)];
                    case 3:
                        // Send notification ?
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_10 = _a.sent();
                        throw error_10;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.setChannelPassword = function (clientId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var caller, error_11, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.channelsService.getClientById(data.channelName, clientId)];
                    case 1:
                        caller = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        throw error_11;
                    case 3:
                        if (caller == undefined || caller.isOwner == false)
                            throw new common_1.ForbiddenException("You are not allowed to do this");
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.channelsService.setPassword(data)];
                    case 5:
                        _a.sent();
                        this.channels.get(data.channelName).changeMode(channel_type_1.ChannelModes.Password);
                        return [3 /*break*/, 7];
                    case 6:
                        error_12 = _a.sent();
                        throw error_12;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.unsetChannelPassword = function (clientId, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var caller, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.channelsService.getClientById(channelName, clientId)];
                    case 1:
                        caller = _a.sent();
                        if (caller == undefined || caller.isOwner == false)
                            throw new common_1.ForbiddenException("You are not allowed to do this");
                        return [4 /*yield*/, this.channelsService.unsetPassword(channelName)];
                    case 2:
                        _a.sent();
                        this.channels.get(channelName).changeMode(channel_type_1.ChannelModes.Public);
                        return [3 /*break*/, 4];
                    case 3:
                        error_13 = _a.sent();
                        throw error_13;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.setPrivateMode = function (clientId, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var caller, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.channelsService.getClientById(channelName, clientId)];
                    case 1:
                        caller = _a.sent();
                        if (caller == undefined || caller.isOwner == false)
                            throw new common_1.ForbiddenException("You are not allowed to do this");
                        return [4 /*yield*/, this.channelsService.setPrivateMode(channelName)];
                    case 2:
                        _a.sent();
                        this.channels.get(channelName).changeMode(channel_type_1.ChannelModes.Private);
                        this.server.emit('activeChannels', this.getActiveChannels());
                        return [3 /*break*/, 4];
                    case 3:
                        error_14 = _a.sent();
                        throw error_14;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.unsetPrivateMode = function (clientId, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var caller, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.channelsService.getClientById(channelName, clientId)];
                    case 1:
                        caller = _a.sent();
                        if (caller == undefined || caller.isOwner == false)
                            throw new common_1.ForbiddenException("You are not allowed to do this");
                        return [4 /*yield*/, this.channelsService.unsetPassword(channelName)];
                    case 2:
                        _a.sent();
                        this.channels.get(channelName).changeMode(channel_type_1.ChannelModes.Public);
                        return [3 /*break*/, 4];
                    case 3:
                        error_15 = _a.sent();
                        throw error_15;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.sendClientInfo = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var data, messages, _a, _b, _c, error_16;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.channelsService.getClientById(channelName, client.login)];
                    case 1:
                        data = _e.sent();
                        return [4 /*yield*/, this.channelsService.getClientMessages(channelName, client.login)];
                    case 2:
                        messages = _e.sent();
                        _b = (_a = client).emit;
                        _c = ["clientInfo"];
                        _d = {
                            isOwner: data.isOwner,
                            isAdmin: data.isAdmin
                        };
                        return [4 /*yield*/, this.channelsService.isMuted(channelName, client.login)];
                    case 3:
                        _b.apply(_a, _c.concat([(_d.isMuted = _e.sent(),
                                _d.unmuteDate = data.unmuteDate,
                                _d.messages = messages,
                                _d)]));
                        return [3 /*break*/, 5];
                    case 4:
                        error_16 = _e.sent();
                        throw error_16;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.sendChannelInfo = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, _a, _b, _c, _d, _e, error_17;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        channel = this.channels.get(channelName);
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        _b = (_a = client).emit;
                        _c = ['channelInfo'];
                        _e = (_d = channel).getInfo;
                        return [4 /*yield*/, this.getChannelClients(channel.id)];
                    case 1:
                        _b.apply(_a, _c.concat([_e.apply(_d, [_f.sent()])]));
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _f.sent();
                        throw error_17;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.sendInvitation = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, user, msg, message, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        channel = this.channels.get(data.channelName);
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(client.login)];
                    case 1:
                        user = _a.sent();
                        msg = "invites you to join a game. Mode: ";
                        switch (data.mode) {
                            case game_type_1.GameMode.Mini:
                                msg += "Mini.";
                                break;
                            case game_type_1.GameMode.Speed:
                                msg += "Speed.";
                                break;
                            default:
                                msg += "Normal.";
                                break;
                        }
                        message = {
                            sender: {
                                login: user.intraLogin,
                                username: user.username
                            },
                            channelName: data.channelName,
                            content: msg,
                            date: new Date().toString(),
                            type: channel_type_1.MessageTypes.Invitation
                        };
                        channel.sendMessage(message);
                        return [4 /*yield*/, this.channelsService.addMessage(data.channelName, message)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_18 = _a.sent();
                        throw error_18;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChannelManager.prototype.getChannelClients = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var clients, channel, _i, _a, _b, clientLogin, roomId, channelInfo, userInfo, _c, _d;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        clients = [];
                        channel = this.channels.get(channelName);
                        if (!channel)
                            throw new common_1.NotFoundException("This channel does not exist anymore");
                        _i = 0, _a = channel.clients;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        _b = _a[_i], clientLogin = _b[0], roomId = _b[1];
                        return [4 /*yield*/, this.channelsService.getClientById(channelName, clientLogin)];
                    case 2:
                        channelInfo = _f.sent();
                        return [4 /*yield*/, this.userService.findOneByIntraLogin(clientLogin)];
                    case 3:
                        userInfo = _f.sent();
                        _d = (_c = clients).push;
                        _e = {
                            login: clientLogin,
                            username: userInfo.username,
                            isOwner: channelInfo.isOwner,
                            isAdmin: channelInfo.isAdmin
                        };
                        return [4 /*yield*/, this.channelsService.isMuted(channelName, clientLogin)];
                    case 4:
                        _d.apply(_c, [(_e.isMuted = _f.sent(),
                                _e)]);
                        _f.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, clients];
                }
            });
        });
    };
    ChannelManager.prototype.getChannel = function (channelId) {
        var channel = this.channels.get(channelId);
        if (channel == undefined)
            throw new common_1.NotFoundException("This channel does not exist anymore");
        return channel;
    };
    ChannelManager.prototype.getActiveChannels = function () {
        var res = [];
        this.channels.forEach(function (channel, id) {
            res.push({
                channelId: id,
                nbClients: channel.clients.size,
                mode: channel.mode,
                owner: channel.owner
            });
        });
        return res;
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], ChannelManager.prototype, "server");
    ChannelManager = __decorate([
        __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return channel_service_1.ChannelsService; }))),
        __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return users_service_1.UsersService; })))
    ], ChannelManager);
    return ChannelManager;
}());
exports.ChannelManager = ChannelManager;
