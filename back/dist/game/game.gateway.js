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
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const lobby_manager_1 = require("./lobby/lobby.manager");
let GameGateway = class GameGateway {
    constructor(lobbyManager) {
        this.lobbyManager = lobbyManager;
    }
    afterInit(server) {
        this.lobbyManager.server = server;
    }
    handleConnection(client) {
        console.log(`Client ${client.id} joined server`);
        this.lobbyManager.initializeSocket(client);
    }
    handleDisconnect(client) {
        console.log(`Client ${client.id} left server`);
        this.lobbyManager.terminateSocket(client);
    }
    createLobby(client) {
        let lobby = this.lobbyManager.createLobby();
        lobby.addClient(client);
        client.emit("lobbyCreated", "Successful creation");
    }
    joiningQueue(client, player) {
        console.log(`Client ${client.id} joined queue`);
        this.lobbyManager.joinQueue(client);
    }
    spectateGame(client, lobbyId) {
        try {
            this.lobbyManager.joinLobby(lobbyId, client);
            console.log('Joined lobby');
            client.emit('spectate');
        }
        catch (error) {
            client.emit('lobbyNotFound', error.message);
        }
    }
    destroyLobby(client) {
        this.lobbyManager.destroyLobby(client.data.lobby.id);
    }
    getActiveGames(client) {
        console.log(this.lobbyManager.getActiveLobbies());
        client.emit('activeGames', this.lobbyManager.getActiveLobbies());
    }
    launchGame(client) {
        client.data.lobby.startGame();
    }
    handlePlayerPosition(client, newPos) {
        var _a;
        const player = (_a = client.data.lobby) === null || _a === void 0 ? void 0 : _a.getUser(client);
        if (!player)
            return;
        player.pos = newPos;
        client.data.lobby.sendToUsers('updatePaddle', { playerId: client.id, newPos: newPos });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createLobby'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "createLobby", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinedQueue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "joiningQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('spectacteGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "spectateGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('destroyLobby'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "destroyLobby", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getActiveGames'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "getActiveGames", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "launchGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playerMoved'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handlePlayerPosition", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8002, { cors: '*' }),
    __metadata("design:paramtypes", [lobby_manager_1.LobbyManager])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map