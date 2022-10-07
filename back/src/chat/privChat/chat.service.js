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
exports.PrivChatService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var users_service_1 = require("../../users/users.service");
var typeorm_2 = require("../../typeorm");
var console_1 = require("console");
var PrivChatService = /** @class */ (function () {
    function PrivChatService(chatRepository, usersService, dataSource) {
        this.chatRepository = chatRepository;
        this.usersService = usersService;
        this.dataSource = dataSource;
    }
    PrivChatService.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.chatRepository.find()];
            });
        });
    };
    PrivChatService.prototype.findOneBy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.chatRepository.findOneBy({ id: id })];
            });
        });
    };
    PrivChatService.prototype.findOneBySenderId = function (userIdFirstSender) {
        return __awaiter(this, void 0, void 0, function () {
            var retVal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatRepository.findOne({
                            where: { UserIdFirstSender: userIdFirstSender }
                        })];
                    case 1:
                        retVal = _a.sent();
                        return [2 /*return*/, retVal];
                }
            });
        });
    };
    PrivChatService.prototype.findOneBySenderReciever = function (userIdFirstSender, userIdFirstReciever) {
        // trying to get it in the right order : if not just returns the natural undefined from findOneBy
        // find by firstName and lastName
        try {
            var retVal = this.chatRepository.findOne({
                where: [
                    { UserIdFirstSender: userIdFirstSender },
                    { UserIdFirstReciever: userIdFirstReciever },
                ]
            });
            if (!retVal)
                retVal = this.chatRepository.findOne({
                    where: [
                        { UserIdFirstSender: userIdFirstReciever,
                            UserIdFirstReciever: userIdFirstSender }
                    ]
                });
        }
        catch (error) {
            console.log('error', error);
        }
        return (retVal);
    };
    PrivChatService.prototype.getChat = function (chat) {
        return __awaiter(this, void 0, void 0, function () {
            var testExist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneBySenderReciever(chat.Sender, chat.Reciever)];
                    case 1:
                        testExist = _a.sent();
                        if (testExist != null)
                            return [2 /*return*/, (testExist)];
                        return [2 /*return*/, (this.createNewChat(chat))];
                }
            });
        });
    };
    PrivChatService.prototype.createNewChat = function (newChat) {
        return __awaiter(this, void 0, void 0, function () {
            var newPrivChat, _a, theResult;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        newPrivChat = this.chatRepository.create(newChat);
                        _a = console_1.log;
                        return [4 /*yield*/, this.chatRepository.save(newPrivChat)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]);
                        return [4 /*yield*/, this.chatRepository.save(newPrivChat)];
                    case 2:
                        theResult = _b.sent();
                        return [2 /*return*/, theResult];
                }
            });
        });
    };
    PrivChatService.prototype.sendMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var senderId, recieverId, getChatEntry, chatMod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // check that both users exist
                        // if not return error
                        if ((this.usersService.findOneByIntraLogin(message.sender.login)) == undefined
                            || this.usersService.findOneByIntraLogin(message.reciever.login) == undefined) {
                            throw new common_1.NotFoundException("Sender or reciever of the message does not exist.");
                        }
                        return [4 /*yield*/, this.usersService.findOneByIntraLogin(message.sender.login)];
                    case 1:
                        senderId = (_a.sent()).intraLogin;
                        return [4 /*yield*/, this.usersService.findOneByIntraLogin(message.reciever.login)];
                    case 2:
                        recieverId = (_a.sent()).intraLogin;
                        getChatEntry = {
                            "Sender": senderId,
                            "Reciever": recieverId,
                            "mess": [message,]
                        };
                        return [4 /*yield*/, this.getChat(getChatEntry)];
                    case 3:
                        chatMod = _a.sent();
                        chatMod.mess.push(message);
                        return [4 /*yield*/, this.chatRepository.update(chatMod.id, chatMod)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PrivChatService.prototype.getMessageList = function (senderId, recieverid) {
        return __awaiter(this, void 0, void 0, function () {
            var getChatInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneBySenderReciever(senderId, recieverid)];
                    case 1:
                        getChatInstance = _a.sent();
                        return [2 /*return*/, (getChatInstance === null || getChatInstance === void 0 ? void 0 : getChatInstance.mess)];
                }
            });
        });
    };
    // chat exists with name and user
    // if chat does'nt exist does the user exist
    PrivChatService.prototype.blockUser = function (id) {
        // if chat doesn't exist -> create it and block the user
        // if chat exists -> find user, find chat...
        //if (this.chatRepository.findOneBy({ UserIdFirstReciever: id }) != null)
        // await (await this.chatRepository.findBy(id);
    };
    PrivChatService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(typeorm_2.PrivChat))
    ], PrivChatService);
    return PrivChatService;
}());
exports.PrivChatService = PrivChatService;
