"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMSession = exports.Match = exports.User = void 0;
const Match_1 = require("./Match");
Object.defineProperty(exports, "Match", { enumerable: true, get: function () { return Match_1.Match; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Session_1 = require("./Session");
Object.defineProperty(exports, "TypeORMSession", { enumerable: true, get: function () { return Session_1.TypeORMSession; } });
const entities = [User_1.User, Match_1.Match, Session_1.TypeORMSession];
exports.default = entities;
//# sourceMappingURL=index.js.map