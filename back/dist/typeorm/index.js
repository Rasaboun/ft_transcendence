"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivChat = exports.TypeORMSession = exports.Channel = exports.Match = exports.User = void 0;
const Match_1 = require("./Match");
Object.defineProperty(exports, "Match", { enumerable: true, get: function () { return Match_1.Match; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Channel_1 = require("./Channel");
Object.defineProperty(exports, "Channel", { enumerable: true, get: function () { return Channel_1.Channel; } });
const Session_1 = require("./Session");
Object.defineProperty(exports, "TypeORMSession", { enumerable: true, get: function () { return Session_1.TypeORMSession; } });
const PrivChat_1 = require("./PrivChat");
Object.defineProperty(exports, "PrivChat", { enumerable: true, get: function () { return PrivChat_1.PrivChat; } });
const entities = [User_1.User, Match_1.Match, Channel_1.Channel, Session_1.TypeORMSession, PrivChat_1.PrivChat];
exports.default = entities;
//# sourceMappingURL=index.js.map