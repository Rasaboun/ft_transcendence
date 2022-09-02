"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const uuid_1 = require("uuid");
const game_type_1 = require("../game.type");
const game_instance_1 = require("../game.instance");
class Lobby {
    constructor(server) {
        this.server = server;
        this.id = (0, uuid_1.v4)();
        this.nbPlayers = 0;
        this.state = game_type_1.GameState.Stopped;
        this.gameInstance = new game_instance_1.GameInstance(this);
        this.clients = new Map();
    }
    addClient(client) {
        this.clients.set(client.id, client);
        client.join(this.id);
        client.data.lobby = this;
        console.log(this.id);
        if (this.nbPlayers < 2) {
            this.gameInstance.addPlayer(client.id);
            this.nbPlayers++;
            if (this.nbPlayers == 1) {
                client.emit("waitingForOpponent");
            }
            else {
                this.gameInstance.sendReady();
            }
        }
        console.log("lobby client ", this.clients.size);
    }
    startGame() {
        if (this.state == game_type_1.GameState.Started)
            return;
        this.state = game_type_1.GameState.Started;
        console.log('In startGame');
        this.gameInstance.resetRound();
        this.gameInstance.gameLoop();
    }
    removeClient(client) {
        client.data.lobby = null;
        client.leave(this.id);
        this.clients.delete(client.id);
        if (this.gameInstance.isPlayer(client.id)) {
            this.clients.forEach((user, id) => {
                this.clients.delete(id);
            });
            this.gameInstance.stop();
            this.nbPlayers = 0;
            this.state = game_type_1.GameState.Stopped;
            this.sendToUsers('gameStopped', "");
        }
    }
    playersId() { return this.gameInstance.playersId(); }
    sendUpdate(event, data) { this.server.to(this.id).emit(event, data); }
    needUpdate(event, data) {
        const [firstClient] = this.clients.keys();
        this.server.to(firstClient).emit(event, data);
    }
    sendToUsers(event, data) { this.server.to(this.id).emit(event, data); }
    getUser(client) {
        return this.gameInstance.getPlayer(client.id);
    }
}
exports.Lobby = Lobby;
//# sourceMappingURL=lobby.js.map