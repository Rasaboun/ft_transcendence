"use strict";
exports.__esModule = true;
exports.initGameData = exports.getMiniModeSettings = exports.getNormalModeSettings = void 0;
var game_type_1 = require("../types/game.type");
var scoreToWin = 10;
function getNormalModeSettings() {
    return {
        scoreToWin: scoreToWin,
        paddleHeight: 200,
        paddleWidth: 50,
        width: 1920,
        height: 1080
    };
}
exports.getNormalModeSettings = getNormalModeSettings;
function getMiniModeSettings() {
    return {
        scoreToWin: scoreToWin,
        paddleHeight: 50,
        paddleWidth: 20,
        width: 1920,
        height: 1080
    };
}
exports.getMiniModeSettings = getMiniModeSettings;
function initGameData() {
    return {
        players: [],
        ball: {
            x: 50,
            y: 50,
            speed: 25,
            radius: 20,
            delta: { x: 0, y: 0 }
        },
        state: game_type_1.GameState.Waiting
    };
}
exports.initGameData = initGameData;
