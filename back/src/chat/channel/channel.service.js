"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.ChannelsService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("../../typeorm");
var channel_type_1 = require("../types/channel.type");
var bcrypt = require("bcrypt");
var ChannelsService = /** @class */ (function () {
    function ChannelsService() {
        this.saltRounds = 10;
    }
    ChannelsService.prototype.findAll = function () {
        return this.channelRepository.find();
    };
    ChannelsService.prototype.findOneById = function (name) {
        return this.channelRepository.findOneBy({ name: name });
    };
    ChannelsService.prototype.addClient = function (channelName, clientId, password) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, newClient, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (!channel)
                            throw new common_1.NotFoundException("Channel not found");
                        if (!(channel.mode == channel_type_1.ChannelModes.Password)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.checkPassword(channelName, password)];
                    case 2:
                        if (!(_a.sent()))
                            throw new common_1.ForbiddenException("Wrong channel password");
                        _a.label = 3;
                    case 3:
                        newClient = new channel_type_1.ChannelClient(clientId);
                        index = this.getClientIndex(channel.mutedList, clientId);
                        if (index != -1) {
                            newClient.unmuteDate = channel.mutedList[index].unmuteDate;
                            newClient.isMuted = true;
                        }
                        if (channel.ownerId == clientId)
                            newClient.isOwner = true;
                        channel.clients.push(newClient);
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.removeClient = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, userIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (!channel)
                            throw new common_1.NotFoundException("Channel not found");
                        userIndex = this.getClientIndex(channel.clients, clientId);
                        if (userIndex == null)
                            throw new common_1.NotFoundException("Client ".concat(clientId, " is not member of channel ").concat(channelName));
                        channel.clients.splice(userIndex, 1);
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.createChannel = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var newChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (data.mode == channel_type_1.ChannelModes.Password)
                            data.password = bcrypt.hashSync(data.password, this.saltRounds);
                        newChannel = this.channelRepository.create(data);
                        return [4 /*yield*/, this.channelRepository.save(newChannel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.deleteChannel = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (!channel)
                            throw new common_1.NotFoundException("This channel does not exist anymore");
                        return [4 /*yield*/, this.channelRepository["delete"](channel.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.addMessage = function (channelName, message) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (!channel)
                            throw new common_1.NotFoundException("Channel not found");
                        channel.messages.push(message);
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.addAdmin = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, clientIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (!channel)
                            throw new common_1.NotFoundException("Channel not found");
                        clientIndex = this.getClientIndex(channel.clients, clientId);
                        if (clientIndex == -1)
                            throw new common_1.NotFoundException("This user is not member of the channel");
                        channel.clients[clientIndex].isAdmin = true;
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.setNewOwner = function (channelName, newOwnerId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, clientIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (!channel)
                            throw new common_1.NotFoundException("Channel not found");
                        clientIndex = this.getClientIndex(channel.clients, newOwnerId);
                        if (clientIndex == -1)
                            throw new common_1.NotFoundException("This user is not member of the channel");
                        channel.clients[clientIndex].isAdmin = true;
                        channel.clients[clientIndex].isOwner = true;
                        channel.ownerId = newOwnerId;
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.muteClient = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(data.channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        client = channel.clients[this.getClientIndex(channel.clients, data.targetId)];
                        if (client == undefined)
                            throw new common_1.NotFoundException("This user is not member of the channel");
                        client.isMuted = true;
                        client.unmuteDate = (new Date().getTime()) + (data.duration * 1000);
                        channel.mutedList.push(client);
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.unmuteClient = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, clientIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        clientIndex = this.getClientIndex(channel.clients, clientId);
                        if (clientIndex == -1)
                            throw new common_1.NotFoundException("This user is not member of the channel");
                        channel.clients[clientIndex].isMuted = false;
                        channel.clients[clientIndex].unmuteDate = 0;
                        channel.mutedList.splice(this.getClientIndex(channel.mutedList, clientId), 1);
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.isMuted = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, client, clientInMuted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        client = channel.clients[this.getClientIndex(channel.clients, clientId)];
                        if (client == undefined)
                            throw new common_1.NotFoundException("This user is not member of the channel");
                        clientInMuted = channel.mutedList[this.getClientIndex(channel.mutedList, client.id)];
                        if (clientInMuted) {
                            client.isMuted = true,
                                client.unmuteDate = clientInMuted.unmuteDate;
                        }
                        if (!(client.isMuted && new Date().getTime() >= client.unmuteDate)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.unmuteClient(channelName, client.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/, client.isMuted];
                }
            });
        });
    };
    ChannelsService.prototype.isAdmin = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        client = channel.clients[this.getClientIndex(channel.clients, clientId)];
                        if (client == undefined)
                            throw new common_1.NotFoundException("This user is not member of the channel");
                        return [2 /*return*/, client.isAdmin];
                }
            });
        });
    };
    ChannelsService.prototype.banClient = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(data.channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        client = channel.clients[this.getClientIndex(channel.clients, data.targetId)];
                        if (client == undefined)
                            throw new common_1.NotFoundException("This user is not member of the channel");
                        client.isBanned = true;
                        client.unbanDate = (new Date().getTime()) + data.duration * 1000;
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.unbanClient = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, clientIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        clientIndex = this.getClientIndex(channel.clients, clientId);
                        if (clientIndex == -1)
                            throw new common_1.NotFoundException("This user is not member of the channel");
                        channel.clients[clientIndex].isBanned = false;
                        channel.clients[clientIndex].unbanDate = 0;
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.setPassword = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(data.channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        channel.mode = channel_type_1.ChannelModes.Password;
                        channel.password = bcrypt.hashSync(data.password, this.saltRounds);
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.unsetPassword = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        channel.mode = channel_type_1.ChannelModes.Public;
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.setPrivateMode = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        channel.mode = channel_type_1.ChannelModes.Private;
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.unsetPrivateMode = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        channel.mode = channel_type_1.ChannelModes.Public;
                        channel.inviteList = [];
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.inviteClient = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(data.channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        channel.inviteList.push(data.clientId); // Get user with id and throw error if does not exist
                        return [4 /*yield*/, this.channelRepository.update(channel.id, channel)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelsService.prototype.checkPassword = function (channelName, password) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        return [2 /*return*/, bcrypt.compareSync(password, channel.password)];
                }
            });
        });
    };
    ChannelsService.prototype.isBanned = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        client = channel.clients[this.getClientIndex(channel.clients, clientId)];
                        if (client == undefined)
                            return [2 /*return*/, false];
                        if (client.isBanned && new Date().getTime() > client.unbanDate) {
                            this.unbanClient(channelName, client.id);
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, client.isBanned];
                }
            });
        });
    };
    ChannelsService.prototype.isClient = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        index = this.getClientIndex(channel.clients, clientId);
                        return [2 /*return*/, index == -1 ? false : true];
                }
            });
        });
    };
    ChannelsService.prototype.isInvited = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        index = channel.inviteList.indexOf(clientId);
                        return [2 /*return*/, index == -1 ? false : true];
                }
            });
        });
    };
    ChannelsService.prototype.getMessages = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (!channel)
                            throw new common_1.NotFoundException("Channel not found");
                        return [2 /*return*/, channel.messages];
                }
            });
        });
    };
    ChannelsService.prototype.getClientMessages = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, index, joinedDate, firstMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        if (channel == undefined)
                            throw new common_1.NotFoundException("This channel does not exist");
                        index = this.getClientIndex(channel.clients, clientId);
                        if (index == -1)
                            throw new common_1.NotFoundException("User is not in this channel");
                        joinedDate = new Date(channel.clients[index].joinedDate);
                        firstMessage = 0;
                        while (firstMessage < channel.messages.length && joinedDate > new Date(channel.messages[firstMessage].date))
                            firstMessage++;
                        return [2 /*return*/, channel.messages.slice(firstMessage)];
                }
            });
        });
    };
    ChannelsService.prototype.getClientById = function (channelName, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(channelName)];
                    case 1:
                        channel = _a.sent();
                        res = null;
                        if (!channel)
                            throw new common_1.NotFoundException("Channel not found");
                        channel.clients.forEach(function (client) {
                            if (client.id == clientId) {
                                res = client;
                                return;
                            }
                        });
                        return [2 /*return*/, res];
                }
            });
        });
    };
    ChannelsService.prototype.getClientIndex = function (clients, id) {
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id == id) {
                return i;
            }
        }
        return -1;
    };
    __decorate([
        (0, typeorm_1.InjectRepository)(typeorm_2.Channel)
    ], ChannelsService.prototype, "channelRepository");
    ChannelsService = __decorate([
        (0, common_1.Injectable)()
    ], ChannelsService);
    return ChannelsService;
}());
exports.ChannelsService = ChannelsService;
