"use strict";
exports.__esModule = true;
exports.PrivChat = void 0;
var PrivChat = /** @class */ (function () {
    function PrivChat(_server, _senderId, _recieverId, _messList) {
        if (_messList === void 0) { _messList = []; }
        this._server = _server;
        this._senderId = _senderId;
        this._recieverId = _recieverId;
        this._messList = _messList;
        this._isBlocked = false;
        this._SenderConnected = false;
        this._RecieverConnected = false;
        //todo add a function to check the connection status of id's
        this._SenderConnected = true;
        this._RecieverConnected = true;
        //check if previous message saved ... if already exists etc
    }
    PrivChat.prototype.sendToUsers = function (event, data) {
        // add this a fct to send to single user
        // this.server.to(this.id).emit(event, data);
    };
    PrivChat.prototype.joinChannel = function () {
    };
    PrivChat.prototype.sendMessage = function (client, senderId, mess) {
        // get the privChat entity to gt first senderandreciever and transform it into a string
        this._server.to(client).emit("privMessageToReciever", { sender: senderId, messCont: mess });
    };
    PrivChat.prototype.setSenderConnected = function (status) {
        this._SenderConnected = status;
    };
    PrivChat.prototype.setRecieverConnected = function (status) {
        this._RecieverConnected = status;
    };
    return PrivChat;
}());
exports.PrivChat = PrivChat;
