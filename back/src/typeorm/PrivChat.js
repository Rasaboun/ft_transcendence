"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PrivChat = void 0;
var channel_type_1 = require("../chat/types/channel.type");
var typeorm_1 = require("typeorm");
var PrivChat = /** @class */ (function () {
    function PrivChat() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('increment')
    ], PrivChat.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], PrivChat.prototype, "UserIdFirstSender");
    __decorate([
        (0, typeorm_1.Column)()
    ], PrivChat.prototype, "UserIdFirstReciever");
    __decorate([
        (0, typeorm_1.Column)({ "default": -1 })
    ], PrivChat.prototype, "UserIdBlocker");
    __decorate([
        (0, typeorm_1.Column)("json", { "default": [] })
    ], PrivChat.prototype, "mess");
    PrivChat = __decorate([
        (0, typeorm_1.Entity)()
    ], PrivChat);
    return PrivChat;
}());
exports.PrivChat = PrivChat;
