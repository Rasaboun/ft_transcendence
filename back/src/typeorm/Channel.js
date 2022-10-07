"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Channel = void 0;
var channel_type_1 = require("../chat/types/channel.type");
var typeorm_1 = require("typeorm");
var Channel = /** @class */ (function () {
    function Channel() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Channel.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "ownerId");
    __decorate([
        (0, typeorm_1.Column)('json', {
            "default": []
        })
    ], Channel.prototype, "clients");
    __decorate([
        (0, typeorm_1.Column)({
            "default": channel_type_1.ChannelModes.Public
        })
    ], Channel.prototype, "mode");
    __decorate([
        (0, typeorm_1.Column)('json', {
            "default": []
        })
    ], Channel.prototype, "messages");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "password");
    __decorate([
        (0, typeorm_1.Column)('text', {
            "default": [],
            array: true
        })
    ], Channel.prototype, "inviteList");
    __decorate([
        (0, typeorm_1.Column)('json', {
            "default": []
        })
    ], Channel.prototype, "mutedList");
    Channel = __decorate([
        (0, typeorm_1.Entity)()
    ], Channel);
    return Channel;
}());
exports.Channel = Channel;
