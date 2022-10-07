"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.MutedException = exports.MessageTypes = exports.ChannelModes = exports.ChannelClient = exports.uuidRegexExp = void 0;
var common_1 = require("@nestjs/common");
exports.uuidRegexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
var ChannelClient = /** @class */ (function () {
    function ChannelClient(id) {
        this.id = id;
        this.isOwner = false;
        this.isAdmin = false;
        this.isMuted = false;
        this.isBanned = false;
        this.unmuteDate = 0;
        this.unbanDate = 0;
        this.joinedDate = new Date();
    }
    return ChannelClient;
}());
exports.ChannelClient = ChannelClient;
var ChannelModes;
(function (ChannelModes) {
    ChannelModes[ChannelModes["Public"] = 0] = "Public";
    ChannelModes[ChannelModes["Private"] = 1] = "Private";
    ChannelModes[ChannelModes["Password"] = 2] = "Password";
})(ChannelModes = exports.ChannelModes || (exports.ChannelModes = {}));
var MessageTypes;
(function (MessageTypes) {
    MessageTypes[MessageTypes["Invitation"] = 0] = "Invitation";
    MessageTypes[MessageTypes["Info"] = 1] = "Info";
    MessageTypes[MessageTypes["Message"] = 2] = "Message";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
var MutedException = /** @class */ (function (_super) {
    __extends(MutedException, _super);
    function MutedException(objectOrError, time, description) {
        return _super.call(this, objectOrError, 401) || this;
    }
    return MutedException;
}(common_1.HttpException));
exports.MutedException = MutedException;
