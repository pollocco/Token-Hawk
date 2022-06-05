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
var Web3 = require("web3");
var WebsocketProvider = require("web3-providers-ws");
var colors = require("colors");
// @ts-ignore
var _ = require("lodash");
var providerOptions = {
    clientConfig: {
        keepalive: true,
        keepaliveInterval: 6000
    },
    reconnect: {
        auto: true,
        delay: 1000,
        maxAttempts: 5,
        onTimeout: false
    }
};
var Web3Controller = /** @class */ (function () {
    function Web3Controller(walletKey, provider) {
        //@ts-ignore
        this.web3 = new Web3(new WebsocketProvider(provider, providerOptions));
        this.web3.eth.accounts.wallet
            .add(walletKey);
        this.subscriptions = new Map();
        this.transferSubs = new Map();
        this.subCount = 0;
    }
    /**
     * Sets listener for liquidity add event on
     * blockchain for a given `pairAddress`. When
     * listener is triggered, prints relevant
     * transaction information and destroys
     * listener.
     *
     * @param {String} baseCurrencyAddress Address of pair's base currency.
     * @param {String} pairAddress Token pair address.
     * @returns {Promise.<boolean>} `Promise` => `true`/`false`
     * depending on whether listener was successfully set.
     */
    Web3Controller.prototype.listenForLiquidityAdd = function (baseCurrencyAddress, pairAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var subs, didNotSet, subscription;
            return __generator(this, function (_a) {
                subs = this.subscriptions;
                try {
                    if (!this.subscriptions.get(pairAddress)) {
                        subscription = this.web3.eth.subscribe('logs', {
                            address: baseCurrencyAddress,
                            topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                                null, '0x000000000000000000000000' + pairAddress.slice(2)]
                        }, function (err, res) {
                            if (!err) {
                                console.log(colors.green("Token liquidity add found!"));
                                console.log("Tx: " + res.transactionHash);
                            }
                            else {
                                console.log(err);
                                didNotSet = true;
                            }
                        }).on("data", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, subscription.unsubscribe()];
                                        case 1:
                                            _a.sent();
                                            subs["delete"](pairAddress);
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        this.subscriptions.set(pairAddress, subscription);
                    }
                    if (didNotSet)
                        return [2 /*return*/, false];
                    return [2 /*return*/, true];
                }
                catch (e) {
                    console.log("listenForLiquidityAdd: " + e);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    Web3Controller.prototype.listenForPairCreated = function (lastBlock, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var didNotSet, subscription;
            return __generator(this, function (_a) {
                try {
                    subscription = this.web3.eth.subscribe('logs', {
                        topics: ['0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9', null, null],
                        fromBlock: lastBlock
                    }, function (err, res) {
                        if (!err) {
                            console.log(colors.red("SUBSCRIPTION PAIR CREATED FOUND"));
                            callback(res);
                        }
                        else {
                            console.log(err);
                            didNotSet = true;
                        }
                    });
                    if (didNotSet)
                        return [2 /*return*/, false];
                    return [2 /*return*/, true];
                }
                catch (e) {
                    console.log("listenForPairCreated: " + e);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    Web3Controller.prototype.subscribeToTransferEvents = function (tokenInterface, tokenAddress, pairAddress, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var didNotSet, options, sub;
            return __generator(this, function (_a) {
                options = {
                    filter: {
                        value: []
                    },
                    fromBlock: "pending"
                };
                try {
                    sub = tokenInterface.events.Transfer(options)
                        .on('data', function (res) {
                        callback(res, tokenAddress, pairAddress);
                    })
                        .on('error', function (err) {
                        console.log("subscribeToTransferEvents: " + err);
                        didNotSet = true;
                    })
                        .on('connected', function (str) {
                        // console.log(str);
                    });
                    this.transferSubs.set(tokenAddress, sub);
                    if (didNotSet)
                        return [2 /*return*/, false];
                    else
                        return [2 /*return*/, true];
                }
                catch (e) {
                    console.log("subscribeToTransferEvents: " + e);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    Web3Controller.prototype.getPairBaseCurrencyBalance = function (pairInterface, pairAddress, tokenAddress, baseCurrency) {
        return __awaiter(this, void 0, void 0, function () {
            var token0, token1, reserves, base, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, pairInterface.methods.token0().call()];
                    case 1:
                        token0 = _a.sent();
                        return [4 /*yield*/, pairInterface.methods.token1().call()];
                    case 2:
                        token1 = _a.sent();
                        return [4 /*yield*/, pairInterface.methods.getReserves().call()];
                    case 3:
                        reserves = _a.sent();
                        base = {
                            amount: 0,
                            address: ''
                        };
                        if (_.toLower(token0) == _.toLower(tokenAddress)) {
                            base.amount = reserves['_reserve1'];
                            base.address = token1;
                        }
                        else {
                            base.amount = reserves['_reserve0'];
                            base.address = token0;
                        }
                        return [2 /*return*/, base];
                    case 4:
                        e_1 = _a.sent();
                        console.log("getPairBaseCurrencyBalance (web3): " + e_1);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Web3Controller.prototype.unsubscribeFrom = function (subscription) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, subscription.unsubscribe()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_2 = _a.sent();
                        console.log("unsubscribeFrom: " + e_2);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Web3Controller.prototype.getTransferSubByAddress = function (tokenAddress) {
        return this.transferSubs.get(tokenAddress);
    };
    /**
     * Attempts to fetch token interface using
     * contract ABI.
     */
    Web3Controller.prototype.getTokenInterface = function (tokenAddress, tokenAbi) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenInterface;
            return __generator(this, function (_a) {
                if (tokenAbi) {
                    try {
                        tokenInterface = new this.web3.eth.Contract(tokenAbi, tokenAddress);
                        return [2 /*return*/, tokenInterface];
                    }
                    catch (e) {
                        console.log("getTokenInterface: " + e);
                        return [2 /*return*/, null];
                    }
                }
                else
                    return [2 /*return*/, null];
                return [2 /*return*/];
            });
        });
    };
    Web3Controller.prototype.getTokenName = function (tokenInterface) {
        return __awaiter(this, void 0, void 0, function () {
            var name, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tokenInterface) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, tokenInterface.methods.name().call()];
                    case 2:
                        name = _a.sent();
                        return [2 /*return*/, name];
                    case 3:
                        e_3 = _a.sent();
                        console.log("getTokenName: " + e_3);
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Web3Controller.prototype.getTokenDecimals = function (tokenInterface) {
        return __awaiter(this, void 0, void 0, function () {
            var decimals, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tokenInterface) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, tokenInterface.methods.decimals().call()];
                    case 2:
                        decimals = _a.sent();
                        return [2 /*return*/, decimals];
                    case 3:
                        e_4 = _a.sent();
                        console.log("getTokenDecimals: " + e_4);
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Web3Controller.prototype.getTokenSymbol = function (tokenInterface) {
        return __awaiter(this, void 0, void 0, function () {
            var symbol, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tokenInterface) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, tokenInterface.methods.symbol().call()];
                    case 2:
                        symbol = _a.sent();
                        return [2 /*return*/, symbol];
                    case 3:
                        e_5 = _a.sent();
                        console.log("getTokenSymbol: " + e_5);
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Web3Controller.prototype.getBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var block, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.web3.eth.getBlockNumber()];
                    case 1:
                        block = _a.sent();
                        return [2 /*return*/, block];
                    case 2:
                        e_6 = _a.sent();
                        console.log("getBlockNumber: " + e_6);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Web3Controller;
}());
exports["default"] = Web3Controller;
