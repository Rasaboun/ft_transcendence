"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInstance = void 0;
const game_type_1 = require("./game.type");
class GameInstance {
    constructor(lobby) {
        this.lobby = lobby;
        this.gameData = {
            players: [],
            ball: {
                x: 50,
                y: 50,
                speed: 20,
                radius: 20,
                delta: { x: 0, y: 0 },
            },
            state: game_type_1.GameState.Waiting,
        };
        this.settings = {
            scoreToWin: 5,
            paddleHeight: 200,
            paddleWidth: 20,
            width: 1920,
            height: 1080,
        };
    }
    handleGoal(nextPos) {
        this.gameData.state = game_type_1.GameState.Goal;
        const winner = nextPos.x - this.gameData.ball.radius < 0 ? 1 : 0;
        this.gameData.players[winner].score += 1;
        this.lobby.sendToUsers("goalScored", this.gameData.players);
        if (this.gameData.players[winner].score === this.settings.scoreToWin) {
            this.gameData.state = game_type_1.GameState.Stopped;
            this.lobby.sendToUsers('gameOver', this.gameData.players[winner].id);
        }
    }
    checkGoals(nextPos) {
        if (nextPos.x - this.gameData.ball.radius < 0 ||
            nextPos.x + this.gameData.ball.radius > this.settings.width)
            return true;
        return false;
    }
    ballHitsLeftPaddle(nextPos) {
        if (nextPos.y <= this.gameData.players[0].pos + this.settings.paddleHeight / 2 &&
            nextPos.y >= this.gameData.players[0].pos - this.settings.paddleHeight / 2) {
            if (nextPos.x - this.gameData.ball.radius < this.settings.paddleWidth) {
                return true;
            }
        }
        return false;
    }
    ballHitsRightPaddle(nextPos) {
        if (nextPos.y <= this.gameData.players[1].pos + this.settings.paddleHeight / 2 &&
            nextPos.y >= this.gameData.players[1].pos - this.settings.paddleHeight / 2) {
            if (nextPos.x + this.gameData.ball.radius > this.settings.width - this.settings.paddleWidth) {
                return true;
            }
        }
        return false;
    }
    ballHitsTopOrBottom(nextPos) {
        if (nextPos.y - this.gameData.ball.radius < 0 || nextPos.y + this.gameData.ball.radius > this.settings.height)
            return true;
        return false;
    }
    gameLoop() {
        if (this.gameData.state === game_type_1.GameState.Started) {
            const nextPos = { x: this.gameData.ball.x + this.gameData.ball.delta.x,
                y: this.gameData.ball.y + this.gameData.ball.delta.y };
            if (this.checkGoals(nextPos) == true) {
                this.handleGoal(nextPos);
                this.resetRound();
            }
            else {
                if (this.ballHitsLeftPaddle(nextPos) || this.ballHitsRightPaddle(nextPos)) {
                    this.gameData.ball.delta.x *= -1;
                }
                else if (this.ballHitsTopOrBottom(nextPos))
                    this.gameData.ball.delta.y *= -1;
                this.gameData.ball.x += this.gameData.ball.delta.x;
                this.gameData.ball.y += this.gameData.ball.delta.y;
                this.lobby.sendToUsers('updateBall', this.gameData.ball);
            }
        }
        if (this.gameData.state != game_type_1.GameState.Stopped)
            setTimeout(() => this.gameLoop(), 30);
    }
    getDelta(speed, radian) { return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed }; }
    ;
    updateBall(x, y, radian) {
        this.gameData.ball.x = x;
        this.gameData.ball.y = y;
        this.gameData.ball.delta = this.getDelta((this.gameData.ball.speed *= 1.01), radian);
        this.lobby.sendToUsers('updateBall', this.gameData.ball);
    }
    resetRound() {
        if (this.gameData.state == game_type_1.GameState.Stopped)
            return;
        let radian = (Math.random() * Math.PI) / 2 - Math.PI / 4;
        if (Math.random() < 0.5)
            radian += Math.PI;
        this.updateBall(this.settings.width / 2, this.settings.height / 2, radian);
        this.resetPaddle();
        this.gameData.state = game_type_1.GameState.Started;
    }
    resetPaddle() {
        this.lobby.sendToUsers('updatePaddle', { playerId: this.gameData.players[0].id, newPos: this.settings.height / 2 });
        this.lobby.sendToUsers('updatePaddle', { playerId: this.gameData.players[1].id, newPos: this.settings.height / 2 });
    }
    stop() {
        this.gameData.players = [];
        this.gameData.state = game_type_1.GameState.Stopped;
    }
    addPlayer(clientId) {
        const newPlayer = {
            id: clientId,
            pos: this.settings.height / 2,
            score: 0,
        };
        this.gameData.players.push(newPlayer);
    }
    sendReady() { this.lobby.sendToUsers("gameReady", this.gameData); }
    isPlayer(clientId) {
        for (let i = 0; i < this.gameData.players.length; i++) {
            if (this.gameData.players[i].id == clientId)
                return true;
        }
        return false;
    }
    getPlayer(playerId) {
        let res = null;
        this.gameData.players.forEach((player) => {
            if (player.id == playerId)
                res = player;
        });
        return res;
    }
    getPlayers() { return this.gameData.players; }
    playersId() {
        let res = [];
        this.gameData.players.forEach((player) => {
            res.push(player.id);
        });
        return res;
    }
}
exports.GameInstance = GameInstance;
//# sourceMappingURL=game.instance.js.map