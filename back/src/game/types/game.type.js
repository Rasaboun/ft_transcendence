"use strict";
exports.__esModule = true;
exports.GameState = exports.GameMode = void 0;
var GameMode;
(function (GameMode) {
    GameMode[GameMode["Normal"] = 0] = "Normal";
    GameMode[GameMode["Mini"] = 1] = "Mini";
    GameMode[GameMode["Speed"] = 2] = "Speed";
})(GameMode = exports.GameMode || (exports.GameMode = {}));
var GameState;
(function (GameState) {
    GameState[GameState["Started"] = 0] = "Started";
    GameState[GameState["Stopped"] = 1] = "Stopped";
    GameState[GameState["Waiting"] = 2] = "Waiting";
    GameState[GameState["Goal"] = 3] = "Goal";
})(GameState = exports.GameState || (exports.GameState = {}));
