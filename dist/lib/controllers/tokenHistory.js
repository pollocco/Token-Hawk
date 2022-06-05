"use strict";
exports.__esModule = true;
var TokenHistory = /** @class */ (function () {
    function TokenHistory(lookBack, block) {
        this.history = new Map();
        this.lookBack = lookBack;
        this.startBlock = block;
    }
    TokenHistory.prototype.getSize = function () {
        return this.history.size;
    };
    TokenHistory.prototype.getHistory = function () {
        return this.history;
    };
    TokenHistory.prototype.find = function (tokenAddress) {
        var token = this.history.get(tokenAddress);
        if (token)
            return token;
        else
            return null;
    };
    TokenHistory.prototype.addToHistory = function (tokenAddress, info) {
        this.history.set(tokenAddress, info);
    };
    TokenHistory.prototype.deleteFromHistory = function (tokenAddress) {
        this.history["delete"](tokenAddress);
    };
    TokenHistory.prototype.clearHistory = function (block) {
        this.history = new Map();
        this.startBlock = block;
    };
    /**
     * Clears from history any entries
     * older than `lookBack`.
     *
     * @param {number} block
     */
    TokenHistory.prototype.clearOldEntries = function (block) {
        var deleted = [];
        for (var _i = 0, _a = this.history; _i < _a.length; _i++) {
            var _b = _a[_i], k = _b[0], v = _b[1];
            if (block - Number(v.blockDiscovered) > this.lookBack) {
                var blockMinusV = block - Number(v.blockDiscovered);
                var outStr = "Deleting " + k + " with age of " + blockMinusV + " blocks.";
                console.log(outStr);
                this.deleteFromHistory(k);
                deleted.push(k);
            }
        }
        return deleted;
    };
    return TokenHistory;
}());
exports["default"] = TokenHistory;
