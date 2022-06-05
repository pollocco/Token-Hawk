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
var webServer_1 = require("./webServer");
var token_1 = require("./token");
var tokenHistory_1 = require("./tokenHistory");
var tradeAnalyzer_1 = require("./tradeAnalyzer");
var helpers_1 = require("./helpers");
var colors = require("colors");
var async_mutex_1 = require("async-mutex");
var mutex = new async_mutex_1.Mutex();
//@ts-ignore
var _ = require("lodash");
var MIN_PAIR_BASE_CURRENCY = BigInt(500000000000000000n);
var BLOCK_DELAY = 300;
var TokenHawk = /** @class */ (function () {
    function TokenHawk(api) {
        var _this = this;
        this.processToken = (function (rawTransaction) {
            if (rawTransaction === null)
                return;
            var tokenAddress;
            if (_this.api.pairCreationBlacklist.indexOf("0x" + rawTransaction.topics[1].slice(26)) != -1) {
                tokenAddress = "0x" + rawTransaction.topics[2].slice(26);
            }
            else {
                tokenAddress = "0x" + rawTransaction.topics[1].slice(26);
            }
            var token = new token_1["default"](_this.api, tokenAddress, rawTransaction.transactionHash, "0x" + rawTransaction.data.slice(26, 66));
            _this.tokenQueue.push(token);
        }).bind(this);
        this.addToUpdateQueueMap = (function (rawTransaction, tokenAddress, pairAddress) {
            if (_.toLower(rawTransaction.address) == _.toLower(tokenAddress)) {
                if (_.toLower(rawTransaction.returnValues.from) == _.toLower(pairAddress) ||
                    _.toLower(rawTransaction.returnValues.to) == _.toLower(pairAddress)) {
                    console.log(colors.blue("Transfer detected for " + tokenAddress));
                    _this.updateQueueMap.set(tokenAddress, true);
                }
            }
        }).bind(this);
        this.api = api;
        this.timestamp;
        this.lastBlock;
        this.tokenHistory;
        this.server;
        this.tokenQueue = [];
        this.updateQueueMap = new Map();
    }
    TokenHawk.prototype.logTimeStats = function () {
        console.log("------------");
        // console.log( colors.bold( "Time: " ) + Date( this.timestamp ).toString() );
        console.log(colors.bold("Last block: ") + this.lastBlock);
        console.log("------------");
    };
    /**
     * Fetches last block from scanner API (e.g. BscScan, Etherscan),
     * trying again on failure until block is successfully obtained.
     *
     * @returns {Promise.<Number>} `Promise` => Most recent block as reported
     * by the scanner API.
     */
    TokenHawk.prototype.waitForLastBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastBlock, hasLastBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasLastBlock = false;
                        _a.label = 1;
                    case 1:
                        if (!!hasLastBlock) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.api.getLastBlock(this.timestamp)];
                    case 2:
                        lastBlock = _a.sent();
                        if (lastBlock) {
                            hasLastBlock = true;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, parseInt(lastBlock)];
                }
            });
        });
    };
    /**
     * Checks the amount of base currency
     * in token's dex pair. If
     * base currency is greater than
     * `MIN_PAIR_BASE_CURRENCY`, returns
     * `true`. If base currency is 0 (not
     * yet given liquidity), a listener is
     * added for liquidity add events and
     * function returns `false`. Also returns
     * `false` if base currency exists but
     * is less than `MIN_PAIR_BASE_CURRENCY`.
     *
     * @param {Token} token - `Token` object.
     * @returns {Promise.<boolean>} `Promise` which
     * evaluates to `true`/`false`.
     */
    TokenHawk.prototype.evaluatePairLiquidity = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(token.pairBaseCurrencyBalance == 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, token.api.listenForLiquidityAdd(token.api.baseCurrency.address, token.pairAddress)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (token.pairBaseCurrencyBalance >= MIN_PAIR_BASE_CURRENCY) {
                            return [2 /*return*/, true];
                        }
                        else
                            return [2 /*return*/, false];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Evaluates `Token` object with interface, first
     * by obtaining and evaluating base currency in
     * token's dex pair. If token is sufficiently
     * liquid, checks for known rugpull/scam signs.
     *
     * @param {Token} token `Token` object.
     */
    TokenHawk.prototype.evaluateInterfacedToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var isSufficientlyLiquid, didInit, topHolder, isKnownLocker, unlockDate, lockUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.evaluatePairLiquidity(token)];
                    case 1:
                        isSufficientlyLiquid = _a.sent();
                        if (!isSufficientlyLiquid) return [3 /*break*/, 6];
                        return [4 /*yield*/, token.initPurchasingProps()];
                    case 2:
                        didInit = _a.sent();
                        if (!didInit) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.api.getTopHolder(token.pairAddress, this.lastBlock)];
                    case 3:
                        topHolder = _a.sent();
                        console.log("Top holder: " + topHolder);
                        return [4 /*yield*/, this.isKnownLocker(topHolder, token.pairAddress)];
                    case 4:
                        isKnownLocker = _a.sent();
                        if (isKnownLocker) {
                            unlockDate = isKnownLocker.unlockDate, lockUrl = isKnownLocker.lockUrl;
                            token.lockStatus = { unlockDate: unlockDate, lockUrl: lockUrl };
                            console.log(token.lockStatus);
                            // var timeToUnlock = parseInt(unlockDate) - (Math.floor(Date.now()/1000));
                            // console.log("Time diff: " + this.getTimeDiffReadable(timeToUnlock));
                        }
                        return [2 /*return*/, true];
                    case 5: return [2 /*return*/, false];
                    case 6: return [2 /*return*/, false];
                }
            });
        });
    };
    TokenHawk.prototype.getTimeDiffReadable = function (time) {
        var dd = Math.floor(time / 60 / 60 / 24);
        time -= dd * 60 * 60 * 24;
        var hh = Math.floor(time / 60 / 60);
        time -= hh * 60 * 60;
        var mm = Math.floor(time / 60);
        time -= mm * 60;
        var ss = time;
        time -= ss;
        return [dd, hh, mm, ss];
    };
    TokenHawk.prototype.isKnownLocker = function (addressToCheck, pairAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var lock;
            return __generator(this, function (_a) {
                if (this.api.lockers) {
                    for (lock in this.api.lockers) {
                        if (this.api.lockers[lock].address === addressToCheck) {
                            console.log(colors.green("top holder matched with " + this.api.lockers[lock].name));
                            return [2 /*return*/, this.api.lockers[lock].getInfo(pairAddress, this.lastBlock - 9999)];
                        }
                    }
                }
                return [2 /*return*/, false];
            });
        });
    };
    TokenHawk.prototype.updateWholeToken = function (oldToken, newToken) {
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                info = {
                    blockDiscovered: oldToken.blockDiscovered,
                    timeDiscovered: oldToken.timeDiscovered,
                    lastUpdated: helpers_1.getTimestamp(),
                    tokenName: newToken.tokenName || "(No name found)",
                    tokenAddress: newToken.tokenAddress,
                    pairBaseCurrencyBalance: newToken.pairBaseCurrencyBalance.toString(),
                    pairAddress: newToken.pairAddress,
                    holders: newToken.holders,
                    slippage: newToken.slippage,
                    tx: newToken.tx,
                    baseCurrencyDecimals: this.api.baseCurrency.decimals,
                    baseCurrencyName: this.api.baseCurrency.ticker,
                    scannerRootUrl: this.api.scannerRootUrl,
                    swapRootUrl: this.api.swapRootUrl,
                    lockStatus: newToken.lockStatus,
                    isRenounced: newToken.isRenounced,
                    renounceTx: newToken.renounceTx
                };
                if (newToken.scScams)
                    info.scScams = newToken.scScams;
                if (newToken.honeypot)
                    info.honeypot = newToken.honeypot;
                this.tokenHistory.addToHistory(oldToken.tokenAddress, info);
                this.server.updateToken(info);
                return [2 /*return*/];
            });
        });
    };
    /*     async updateTokenProp( token, property ) {
            var tok = this.tokenHistory.find( token.tokenAddress );
            if( any[property] == 'bigint' ) tok[property] = token[property].toString();
            else tok[property] = token[property];
            tok.lastUpdated = getTimestamp();
            this.addTokenToHistory( tok );
        } */
    TokenHawk.prototype.addTokenToHistory = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                info = {
                    blockDiscovered: this.lastBlock.toString(),
                    timeDiscovered: helpers_1.getTimestamp(),
                    lastUpdated: helpers_1.getTimestamp(),
                    tokenName: token.tokenName || "(No name found)",
                    tokenAddress: token.tokenAddress,
                    pairBaseCurrencyBalance: token.pairBaseCurrencyBalance.toString(),
                    baseCurrencyDecimals: this.api.baseCurrency.decimals,
                    baseCurrencyName: this.api.baseCurrency.ticker,
                    pairAddress: token.pairAddress,
                    slippage: token.slippage,
                    holders: token.holders,
                    tx: token.tx,
                    scannerRootUrl: this.api.scannerRootUrl,
                    swapRootUrl: this.api.swapRootUrl,
                    lockStatus: token.lockStatus,
                    isRenounced: token.isRenounced,
                    renounceTx: token.renounceTx
                };
                if (token.scScams)
                    info.scScams = token.scScams;
                if (token.honeypot)
                    info.honeypot = token.honeypot;
                this.tokenHistory.addToHistory(token.tokenAddress, info);
                this.server.sendTokens();
                return [2 /*return*/];
            });
        });
    };
    TokenHawk.prototype.addIndividualToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var release, didInit, didGetProps, tokInfoObj, tok;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mutex.acquire()];
                    case 1:
                        release = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 19, 20]);
                        return [4 /*yield*/, token.initTokenProps()];
                    case 3:
                        didInit = _a.sent();
                        if (!didInit) return [3 /*break*/, 17];
                        if (!!this.tokenHistory.find(token.tokenAddress)) return [3 /*break*/, 8];
                        token.printTokenSummary();
                        return [4 /*yield*/, this.evaluateInterfacedToken(token)];
                    case 4:
                        didGetProps = _a.sent();
                        return [4 /*yield*/, this.addTokenToHistory(token)];
                    case 5:
                        _a.sent();
                        tokInfoObj = this.tokenHistory.history.get(token.tokenAddress);
                        if (!(tokInfoObj && didGetProps)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.tradeAnalyzer.evaluateToken(tokInfoObj)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        console.log("");
                        return [3 /*break*/, 15];
                    case 8:
                        tok = this.tokenHistory.find(token.tokenAddress);
                        if (!tok) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.evaluateInterfacedToken(token)];
                    case 9:
                        _a.sent();
                        if (!(!_.isEqual(tok.pairBaseCurrencyBalance, token.pairBaseCurrencyBalance) ||
                            !_.isEqual(tok.holders, token.holders) ||
                            !_.isEqual(tok.lockStatus, token.lockStatus))) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.updateWholeToken(tok, token)];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 11:
                        if (!(token.honeypot &&
                            tok.honeypot &&
                            !_.isEqual(tok.honeypot, token.honeypot))) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.updateWholeToken(tok, token)];
                    case 12:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        if (!(token.scScams && tok.scScams && !_.isEqual(tok.scScams, token.scScams))) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.updateWholeToken(tok, token)];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15: return [4 /*yield*/, this.api.subscribeToTransferEvents(token.tokenInterface, token.tokenAddress, token.pairAddress, this.addToUpdateQueueMap)];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [4 /*yield*/, helpers_1.sleep(1000)];
                    case 18:
                        _a.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        release();
                        return [7 /*endfinally*/];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    TokenHawk.prototype.handleUpdate = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var token, tok, didInit, updated, tokInfoObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = new token_1["default"](this.api, value.tokenAddress, value.tx, value.pairAddress);
                        console.log("Entered handleUpdate method");
                        tok = this.tokenHistory.find(token.tokenAddress);
                        return [4 /*yield*/, token.initTokenProps()];
                    case 1:
                        didInit = _a.sent();
                        if (!(tok && didInit)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.evaluateInterfacedToken(token)];
                    case 2:
                        updated = _a.sent();
                        tokInfoObj = this.tokenHistory.find(token.tokenAddress);
                        if (!tokInfoObj) return [3 /*break*/, 13];
                        if (!(!_.isEqual(tok.pairBaseCurrencyBalance, token.pairBaseCurrencyBalance) ||
                            !_.isEqual(tok.holders, token.holders) ||
                            !_.isEqual(tok.lockStatus, token.lockStatus))) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.updateWholeToken(tok, token)];
                    case 3:
                        _a.sent();
                        if (!updated) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.tradeAnalyzer.evaluateToken(tokInfoObj)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 13];
                    case 6:
                        if (!(token.honeypot &&
                            tok.honeypot &&
                            !_.isEqual(tok.honeypot, token.honeypot))) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.updateWholeToken(tok, token)];
                    case 7:
                        _a.sent();
                        if (!updated) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.tradeAnalyzer.evaluateToken(tokInfoObj)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        if (!(token.scScams && tok.scScams && !_.isEqual(tok.scScams, token.scScams))) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.updateWholeToken(tok, token)];
                    case 11:
                        _a.sent();
                        if (!updated) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.tradeAnalyzer.evaluateToken(tokInfoObj)];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    TokenHawk.prototype.updateTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var release, history;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mutex.acquire()];
                    case 1:
                        release = _a.sent();
                        try {
                            console.log("Entered update method");
                            if (this.tokenHistory.getSize() === 0) {
                                console.log("Nothing in history");
                                return [2 /*return*/];
                            }
                            else {
                                history = this.tokenHistory.getHistory();
                                history.forEach(function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!this.updateQueueMap.get(key)) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.handleUpdate(key, value)];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, helpers_1.sleep(1200)];
                                            case 2:
                                                _a.sent();
                                                this.updateQueueMap["delete"](key);
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                console.log("Exiting update method.");
                            }
                        }
                        finally {
                            release();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TokenHawk.prototype.processTokenQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                while (this.tokenQueue.length > 0) {
                    token = this.tokenQueue.shift();
                    this.addIndividualToken(token);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Main entry point for `TokenHawk` workflow. Establishes
     * `tokenHistory`, `timestamp`, and `lastBlock` properties
     * before entering main loop, which finds and evaluates
     * new tokens as they're added to the blockchain. Sleeps
     * for `timeBetweenIterations` ms between each execution
     * of the main loop.
     *
     * @param {Number} timeBetweenIterations ms between loop
     * iterations.
     * @return {Promise.<void>} `Promise` => none
     */
    TokenHawk.prototype.run = function (timeBetweenIterations) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, t, _b, deleted, _i, deleted_1, item, sub;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.timestamp = helpers_1.getTimestamp();
                        _a = this;
                        return [4 /*yield*/, this.api.getBlockWeb3()];
                    case 1:
                        _a.lastBlock = _c.sent();
                        this.tokenHistory = new tokenHistory_1["default"](BLOCK_DELAY, this.lastBlock);
                        this.server = new webServer_1["default"](this.tokenHistory.history, 3003);
                        return [4 /*yield*/, this.server.launch()];
                    case 2:
                        _c.sent();
                        this.tradeAnalyzer = new tradeAnalyzer_1["default"](BigInt(50000000000000000n), this.api, this.server);
                        return [4 /*yield*/, this.api.listenForPairCreated(this.lastBlock - BLOCK_DELAY, this.processToken)];
                    case 3:
                        t = _c.sent();
                        _c.label = 4;
                    case 4:
                        if (!true) return [3 /*break*/, 11];
                        this.timestamp = helpers_1.getTimestamp();
                        _b = this;
                        return [4 /*yield*/, this.waitForLastBlock()];
                    case 5:
                        _b.lastBlock = _c.sent();
                        if (!(this.tokenQueue.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.processTokenQueue()];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        if (!(this.updateQueueMap.size > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.updateTokens()];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        deleted = this.tokenHistory.clearOldEntries(this.lastBlock);
                        for (_i = 0, deleted_1 = deleted; _i < deleted_1.length; _i++) {
                            item = deleted_1[_i];
                            sub = this.api.getTransferSubByAddress(item);
                            this.api.unsubscribeFrom(sub);
                        }
                        return [4 /*yield*/, helpers_1.sleep(timeBetweenIterations)];
                    case 10:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return TokenHawk;
}());
exports["default"] = TokenHawk;
