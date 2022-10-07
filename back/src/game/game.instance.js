"use strict";
exports.__esModule = true;
exports.GameInstance = void 0;
var game_type_1 = require("./types/game.type");
var game_settings_1 = require("./utils/game.settings");
var GameInstance = /** @class */ (function () {
    function GameInstance(lobby, mode) {
        this.lobby = lobby;
        this.mode = mode;
        this.gameData = (0, game_settings_1.initGameData)();
        if (mode == game_type_1.GameMode.Normal) {
            this.settings = (0, game_settings_1.getNormalModeSettings)();
        }
        else if (mode == game_type_1.GameMode.Mini) {
            this.settings = (0, game_settings_1.getMiniModeSettings)();
            this.gameData.ball.radius = this.gameData.ball.radius / 4;
        }
        else if (mode == game_type_1.GameMode.Speed) {
            this.settings = (0, game_settings_1.getNormalModeSettings)();
            this.gameData.ball.speed *= 2;
        }
    }
    GameInstance.prototype.handleGoal = function (nextPos) {
        this.gameData.state = game_type_1.GameState.Goal;
        var winner = nextPos.x - this.gameData.ball.radius < 0 ? 1 : 0;
        this.gameData.players[winner].score += 1;
        this.lobby.sendToUsers("goalScored", { player1: this.gameData.players[0].score, player2: this.gameData.players[1].score });
        if (this.gameData.players[winner].score === this.settings.scoreToWin) {
            this.gameData.state = game_type_1.GameState.Stopped;
            this.lobby.sendToUsers('gameOver', this.gameData.players[winner].id);
            this.lobby.destroy();
        }
    };
    GameInstance.prototype.checkGoals = function (nextPos) {
        if (nextPos.x - this.gameData.ball.radius < 0 ||
            nextPos.x + this.gameData.ball.radius > this.settings.width)
            return true;
        return false;
    };
    GameInstance.prototype.ballHitsLeftPaddel = function (nextPos) {
        if (nextPos.y <= this.gameData.players[0].pos + this.settings.paddleHeight / 2 &&
            nextPos.y >= this.gameData.players[0].pos - this.settings.paddleHeight / 2) {
            if (nextPos.x - this.gameData.ball.radius < this.settings.paddleWidth) {
                //this.updateBall(this.gameData.ball.x, this.gameData.ball.y, (Math.random() * Math.PI) / 2 - Math.PI / 4);
                return true;
            }
        }
        return false;
    };
    GameInstance.prototype.ballHitsRightPaddel = function (nextPos) {
        if (nextPos.y <= this.gameData.players[1].pos + this.settings.paddleHeight / 2 &&
            nextPos.y >= this.gameData.players[1].pos - this.settings.paddleHeight / 2) {
            if (nextPos.x + this.gameData.ball.radius > this.settings.width - this.settings.paddleWidth) {
                return true; //return this.updateBall(this.gameData.ball.x, this.gameData.ball.y, (Math.random() * Math.PI) / 2 - Math.PI / 4 + Math.PI);
            }
        }
        return false;
    };
    GameInstance.prototype.ballHitsTopOrBottom = function (nextPos) {
        if (nextPos.y - this.gameData.ball.radius < 0 || nextPos.y + this.gameData.ball.radius > this.settings.height)
            return true;
        return false;
    };
    GameInstance.prototype.gameLoop = function () {
        var _this = this;
        if (this.gameData.state === game_type_1.GameState.Started) {
            var nextPos = { x: this.gameData.ball.x + this.gameData.ball.delta.x,
                y: this.gameData.ball.y + this.gameData.ball.delta.y };
            //console.log("Players", this.gameData.players);
            if (this.checkGoals(nextPos) == true) {
                this.handleGoal(nextPos);
                this.resetRound();
            }
            else {
                if (this.ballHitsLeftPaddel(nextPos) || this.ballHitsRightPaddel(nextPos))
                    this.gameData.ball.delta.x *= -1;
                else if (this.ballHitsTopOrBottom(nextPos))
                    this.gameData.ball.delta.y *= -1;
                this.gameData.ball.x += this.gameData.ball.delta.x;
                this.gameData.ball.y += this.gameData.ball.delta.y;
                this.lobby.sendToUsers('updateBall', this.gameData.ball);
            }
        }
        if (this.gameData.state != game_type_1.GameState.Stopped)
            setTimeout(function () { return _this.gameLoop(); }, 30);
    };
    GameInstance.prototype.getDelta = function (speed, radian) { return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed }; };
    ;
    GameInstance.prototype.updateBall = function (x, y, radian) {
        this.gameData.ball.x = x;
        this.gameData.ball.y = y;
        this.gameData.ball.delta = this.getDelta((this.gameData.ball.speed *= 1.01), radian);
        this.lobby.sendToUsers('updateBall', this.gameData.ball);
    };
    GameInstance.prototype.resetRound = function () {
        if (this.gameData.state == game_type_1.GameState.Stopped)
            return;
        var radian = (Math.random() * Math.PI) / 2 - Math.PI / 4;
        //1 chance on 2 to go left
        if (Math.random() < 0.5)
            radian += Math.PI;
        this.updateBall(this.settings.width / 2, this.settings.height / 2, radian);
        this.gameData.state = game_type_1.GameState.Started;
    };
    GameInstance.prototype.stop = function () {
        this.gameData.players = [];
        this.gameData.state = game_type_1.GameState.Stopped;
    };
    GameInstance.prototype.addPlayer = function (clientId) {
        var newPlayer = {
            id: clientId,
            pos: this.settings.height / 2,
            score: 0
        };
        this.gameData.players.push(newPlayer);
    };
    GameInstance.prototype.sendReady = function () { this.lobby.sendToUsers("gameReady", { gameData: this.gameData, gameSettings: this.settings }); };
    GameInstance.prototype.isPlayer = function (clientId) {
        for (var i = 0; i < this.gameData.players.length; i++) {
            if (this.gameData.players[i].id == clientId)
                return true;
        }
        return false;
    };
    GameInstance.prototype.updatePlayer = function (playerLogin, newPos) {
        if (this.gameData.players[0].id == playerLogin)
            this.gameData.players[0].pos = newPos;
        else
            this.gameData.players[1].pos = newPos;
    };
    GameInstance.prototype.getPlayer = function (playerId) {
        var res = null;
        this.gameData.players.forEach(function (player) {
            if (player.id == playerId)
                res = player;
        });
        return res;
    };
    GameInstance.prototype.getGameData = function () {
        return { gameData: this.gameData, gameSettings: this.settings };
    };
    GameInstance.prototype.playersId = function () {
        var res = [];
        this.gameData.players.forEach(function (player) {
            res.push(player.id);
        });
        return res;
    };
    return GameInstance;
}());
exports.GameInstance = GameInstance;
