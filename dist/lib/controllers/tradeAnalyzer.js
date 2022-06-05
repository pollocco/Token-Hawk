"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var TradeAnalyzer = /** @class */ (function () {
    function TradeAnalyzer(maxTrade, api, server) {
        this.maxTrade = maxTrade;
        this.api = api;
        this.server = server;
        this.balance = BigInt(300000000000000000n);
        this.trades = new Map();
    }
    TradeAnalyzer.prototype.evaluateToken = function (token) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var buyObj, e_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.trades.get(token.tokenAddress))
                            return [2 /*return*/];
                        if (!(token.lockStatus && (token.lockStatus.unlockDate - Math.floor(Date.now() / 1000)) > 60 * 60 * 8)) return [3 /*break*/, 4];
                        if (!(parseInt(token.pairBaseCurrencyBalance) * Math.pow(10, -1 * token.baseCurrencyDecimals) > 0.2)) return [3 /*break*/, 4];
                        if (!(!((_a = token.scScams) === null || _a === void 0 ? void 0 : _a.isCollectable) && !((_b = token.honeypot) === null || _b === void 0 ? void 0 : _b.IsHoneypot))) return [3 /*break*/, 4];
                        if (!(token.slippage.buy < 0.12 && token.slippage.sell < 0.12)) return [3 /*break*/, 4];
                        if (this.balance < this.maxTrade) {
                            this.server.sendToWebConsole("Wanted to trade "
                                + token.tokenName
                                + " ("
                                + token.tokenAddress
                                + ") "
                                + "...but I'm broke!");
                            return [2 /*return*/];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.api.getLatestPrice(token.tokenAddress, token.slippage.buy, this.maxTrade.toString())];
                    case 2:
                        buyObj = _c.sent();
                        this.server.sendToWebConsole("Paper trade: Buying "
                            + buyObj.buyAmount + " "
                            + token.tokenName
                            + " ("
                            + token.tokenAddress
                            + ") "
                            + " for " + (buyObj.sellAmount * Math.pow(10, -1 * token.baseCurrencyDecimals)).toFixed(5)
                            + " " + token.baseCurrencyName
                            + '\n');
                        this.trades.set(token.tokenAddress, buyObj);
                        console.log(this.balance);
                        this.balance -= BigInt(buyObj.sellAmount);
                        this.balance -= BigInt(buyObj.gas * buyObj.gasPrice);
                        console.log(this.balance);
                        setTimeout(function () {
                            _this.sellToken(token);
                        }, 60000 * 5);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        console.log("evaluateToken: " + e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TradeAnalyzer.prototype.sellToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var buyObj, sellObj, bal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buyObj = this.trades.get(token.tokenAddress);
                        return [4 /*yield*/, this.api.getLatestSellPrice(token.tokenAddress, token.slippage.sell, buyObj.buyAmount)];
                    case 1:
                        sellObj = _a.sent();
                        this.server.sendToWebConsole("Paper trade: Sold "
                            + parseInt(sellObj.sellAmount).toFixed(5) + " "
                            + token.tokenName + " for "
                            + (parseInt(sellObj.buyAmount) * Math.pow(10, -1 * token.baseCurrencyDecimals)).toFixed(5)
                            + " " + token.baseCurrencyName
                            + '\n');
                        this.balance += BigInt(sellObj.buyAmount);
                        this.balance -= BigInt(sellObj.gas * sellObj.gasPrice);
                        bal = Number(this.balance) * (Math.pow(10, -1 * token.baseCurrencyDecimals));
                        this.server.sendToWebConsole("Balance: " + bal);
                        return [2 /*return*/];
                }
            });
        });
    };
    return TradeAnalyzer;
}());
exports["default"] = TradeAnalyzer;
