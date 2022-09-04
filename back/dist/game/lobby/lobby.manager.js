"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyManager = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const websockets_1 = require("@nestjs/websockets");
const game_type_1 = require("../game.type");
const lobby_1 = require("./lobby");
class LobbyManager {
    constructor() {
        this.lobbies = new Map();
        this.avalaibleLobbies = [];
    }
    initializeSocket(client) {
        client.data.lobby = null;
    }
    terminateSocket(client) {
        var _a;
        console.log("Leaving socket");
        (_a = client.data.lobby) === null || _a === void 0 ? void 0 : _a.removeClient(client);
    }
    createLobby() {
        let lobby = new lobby_1.Lobby(this.server);
        this.lobbies.set(lobby.id, lobby);
        return lobby;
    }
    joinQueue(client) {
        let lobby;
        if (this.avalaibleLobbies.length > 0)
            lobby = this.avalaibleLobbies.shift();
        else {
            lobby = this.createLobby();
            this.avalaibleLobbies.push(lobby);
        }
        lobby.addClient(client);
    }
    destroyLobby(lobbyId) {
        if (lobbyId == null)
            return;
        const lobby = this.lobbies.get(lobbyId);
        if (lobby == null)
            return;
        lobby.clear();
        this.lobbies.delete(lobbyId);
    }
    joinLobby(lobbyId, client) {
        console.log(`Spectacte lobby ${lobbyId}`);
        const lobby = this.lobbies.get(lobbyId);
        if (lobby == undefined)
            throw new common_1.NotFoundException("This lobby does not exist anymore");
        lobby === null || lobby === void 0 ? void 0 : lobby.addClient(client);
    }
    getActiveLobbies() {
        let res = [];
        this.lobbies.forEach((lobby, id) => {
            if (lobby.state == game_type_1.GameState.Started && lobby.nbPlayers == 2) {
                res.push({
                    lobbyId: id,
                    playersId: lobby.playersId(),
                });
            }
        });
        return res;
    }
    lobbiesCleaner() {
        for (let i = 0; i < this.avalaibleLobbies.length; i++) {
            if (this.avalaibleLobbies[i].nbPlayers == 0) {
                this.avalaibleLobbies.splice(i, 1);
            }
        }
        console.log(`Avalaible lobbies: ${this.avalaibleLobbies.length}`);
        this.lobbies.forEach((lobby, id) => {
            console.log(lobby.nbPlayers);
            if (lobby.state == game_type_1.GameState.Stopped && lobby.nbPlayers == 0) {
                this.lobbies.delete(id);
            }
        });
        console.log(`Active lobbies: ${this.lobbies.size}`);
    }
}
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], LobbyManager.prototype, "server", void 0);
__decorate([
    (0, schedule_1.Interval)(60 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LobbyManager.prototype, "lobbiesCleaner", null);
exports.LobbyManager = LobbyManager;
//# sourceMappingURL=lobby.manager.js.map