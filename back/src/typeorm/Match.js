"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Match = void 0;
var typeorm_1 = require("typeorm");
var Match = /** @class */ (function () {
    function Match() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('increment')
    ], Match.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Match.prototype, "date");
    __decorate([
        (0, typeorm_1.Column)()
    ], Match.prototype, "playerOneId");
    __decorate([
        (0, typeorm_1.Column)()
    ], Match.prototype, "playerTwoId");
    __decorate([
        (0, typeorm_1.Column)()
    ], Match.prototype, "playerOneScore");
    __decorate([
        (0, typeorm_1.Column)()
    ], Match.prototype, "playerTwoScore");
    Match = __decorate([
        (0, typeorm_1.Entity)()
    ], Match);
    return Match;
}());
exports.Match = Match;
