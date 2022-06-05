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
var node_fetch_1 = require("node-fetch");
var contractUtils_1 = require("./contractUtils");
var colors = require("colors");
var Token = /** @class */ (function () {
    function Token(api, tokenAddress, tx, pairAddress) {
        this.api = api;
        this.tokenAddress = tokenAddress;
        this.tokenName;
        this.tx = tx;
        this.pairAddress = pairAddress;
        this.pairBaseCurrencyBalance;
        this.tokenInterface;
        this.honeypot;
        this.scScams;
        this.holders;
        this.lockStatus;
        this.isRenounced;
        this.renounceTx;
    }
    Token.prototype.getContractScamsObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sourceCode, isCollectable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.getContractSourceCode(this.tokenAddress)];
                    case 1:
                        sourceCode = _a.sent();
                        if (sourceCode) {
                            isCollectable = contractUtils_1["default"].isCollectable(sourceCode);
                            this.scScams = {
                                "isCollectable": isCollectable
                            };
                            return [2 /*return*/, this.scScams];
                        }
                        else
                            return [2 /*return*/, null];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Uses honeypot.is API to perform a honeypot check (a
     * 'honeypot' is a token which cannot be sold), and returning
     * the results of the scan if successful, or null if the
     * request failed (or `honeypotNetwork` property is not set
     * on the given `API` instance).
     *
     * @param {boolean} printResults Whether to print results of
     * honeypot check to `stdout`.
     * @returns {Promise.<Object|boolean>} `Promise` =>
     * depending on whether request was successful.
     */
    Token.prototype.getHoneypotCheck = function (printResults) {
        return __awaiter(this, void 0, void 0, function () {
            function logHoneypot(honeypot) {
                console.log(honeypot);
            }
            var honeypotUrl, honeypotReq, honeypot, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.api.honeypotNetwork) return [3 /*break*/, 6];
                        honeypotUrl = 'https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot'
                            + '?chain=' + this.api.honeypotNetwork
                            + '&token=' + this.tokenAddress;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, node_fetch_1["default"](honeypotUrl)];
                    case 2:
                        honeypotReq = _a.sent();
                        return [4 /*yield*/, honeypotReq.json()];
                    case 3:
                        honeypot = _a.sent();
                        if (printResults) {
                            logHoneypot(honeypot);
                        }
                        return [2 /*return*/, honeypot];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, null];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Token.prototype.getSlippageObject = function (buyTax, sellTax) {
        return __awaiter(this, void 0, void 0, function () {
            var slippage;
            return __generator(this, function (_a) {
                slippage = {
                    buy: buyTax / 100 + 0.03,
                    sell: sellTax / 100 + 0.03
                };
                return [2 /*return*/, slippage];
            });
        });
    };
    /**
     * Prints token name, base currency liquidity of
     * token pair, and address.
     *
     * @returns {Promise.<boolean>} `Promise` => `true`/`null` depending on
     * whether report was successfully printed to
     * `stdout`.
     */
    Token.prototype.printTokenSummary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name_1, baseCurrencyMultiplier, baseCurrencyReadable;
            return __generator(this, function (_a) {
                if (this.tokenInterface) {
                    if (!this.tokenName)
                        name_1 = "(No name)";
                    else
                        name_1 = this.tokenName;
                    baseCurrencyMultiplier = Math.pow(10, (this.api.baseCurrency.decimals * -1));
                    baseCurrencyReadable = Number(this.pairBaseCurrencyBalance) * baseCurrencyMultiplier;
                    console.log(colors.yellow("Name: ") + name_1);
                    console.log(colors.yellow(this.api.baseCurrency.ticker + " in liq: ") + baseCurrencyReadable);
                    console.log(colors.yellow("Token address: ") + this.tokenAddress);
                    return [2 /*return*/, true];
                }
                else
                    return [2 /*return*/, false];
                return [2 /*return*/];
            });
        });
    };
    /**
     * Attempts to fetch token interface. If
     * successful, sets the tokens interface
     * property, then sets `pairBaseCurrency`
     * prop on token and returns `true`. Otherwise
     * `false`.
     *
     * @returns {Promise.<boolean>} `Promise` => `true`/`false` depending
     * on whether `tokenInterface`/`pairBaseCurrency` was set on
     * `Token` object.
     */
    Token.prototype.initTokenProps = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAbi, tokenInterface, _a, _b, lastBlock, _c, allTransactions, renounceTx, e_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, this.api.getTokenAbi(this.tokenAddress)];
                    case 1:
                        tokenAbi = _d.sent();
                        if (!tokenAbi)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.api.getTokenInterface(this.tokenAddress, tokenAbi)];
                    case 2:
                        tokenInterface = _d.sent();
                        if (!!tokenInterface) return [3 /*break*/, 3];
                        return [2 /*return*/, false];
                    case 3:
                        this.tokenInterface = tokenInterface;
                        _a = this;
                        return [4 /*yield*/, this.api.getPairBaseCurrencyBalance(this.pairAddress)];
                    case 4:
                        _a.pairBaseCurrencyBalance = _d.sent();
                        _b = this;
                        return [4 /*yield*/, this.api.getTokenName(this.tokenInterface)];
                    case 5:
                        _b.tokenName = _d.sent();
                        return [4 /*yield*/, this.api.getBlockWeb3()];
                    case 6:
                        lastBlock = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this.api.getHolders(this.tokenAddress, lastBlock)];
                    case 7:
                        _c.holders = _d.sent();
                        return [4 /*yield*/, this.api.getTransactionsForAddress(this.tokenAddress)];
                    case 8:
                        allTransactions = _d.sent();
                        renounceTx = this.getRenounced(allTransactions);
                        if (renounceTx) {
                            this.isRenounced = true;
                            this.renounceTx = renounceTx;
                        }
                        if (this.tokenName && this.holders && this.pairBaseCurrencyBalance != null)
                            return [2 /*return*/, true];
                        else
                            return [2 /*return*/, false];
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_2 = _d.sent();
                        console.log(e_2);
                        return [2 /*return*/, false];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Token.prototype.getRenounced = function (transactions) {
        if (transactions === null)
            return;
        for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
            var t = transactions_1[_i];
            for (var _a = 0, _b = t["log_events"]; _a < _b.length; _a++) {
                var l = _b[_a];
                if (l["decoded"] && l["decoded"]["name"] && l["decoded"]["name"] == "OwnershipTransferred") {
                    for (var _c = 0, _d = l["decoded"]["params"]; _c < _d.length; _c++) {
                        var param = _d[_c];
                        if (param["name"] == "newOwner" && param["value"] == "0x0000000000000000000000000000000000000000") {
                            return t["tx_hash"];
                        }
                    }
                }
            }
        }
        return null;
    };
    Token.prototype.initPurchasingProps = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getHoneypotCheck(false)];
                    case 1:
                        _a.honeypot = _d.sent();
                        if (!this.honeypot) return [3 /*break*/, 4];
                        _b = this;
                        return [4 /*yield*/, this.getContractScamsObject()];
                    case 2:
                        _b.scScams = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this.getSlippageObject(this.honeypot.BuyTax, this.honeypot.SellTax)];
                    case 3:
                        _c.slippage = _d.sent();
                        if (this.scScams && this.slippage)
                            return [2 /*return*/, true];
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Token;
}());
exports["default"] = Token;
