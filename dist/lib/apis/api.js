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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var web3Controller_1 = require("../controllers/web3Controller");
var api0x_1 = require("./api0x");
var covalentApi_1 = require("./covalentApi");
var scannerApi_1 = require("./scannerApi");
var Api = /** @class */ (function () {
    function Api(rootUrl, baseCurrency, web3Settings, scannerApiKey, api0xSettings, covalentApiSettings) {
        this.rootUrl = rootUrl;
        this.baseCurrency = baseCurrency;
        this.scannerApiKey = scannerApiKey;
        this.web3 = new web3Controller_1["default"](web3Settings.walletKey, web3Settings.provider);
        this.api0x = new (api0x_1["default"].bind.apply(api0x_1["default"], __spreadArrays([void 0], Object.values(api0xSettings))))();
        this.covalentApi = new (covalentApi_1["default"].bind.apply(covalentApi_1["default"], __spreadArrays([void 0], Object.values(covalentApiSettings))))();
        this.scannerApi = new scannerApi_1["default"](rootUrl, scannerApiKey, baseCurrency);
    }
    Api.prototype.getLastBlock = function (timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scannerApi.getLastBlock(timestamp)];
                    case 1:
                        block = _a.sent();
                        return [2 /*return*/, block];
                }
            });
        });
    };
    Api.prototype.getPairBaseCurrencyBalance = function (pairAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var bcBalance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scannerApi.getPairBaseCurrencyBalance(pairAddress)];
                    case 1:
                        bcBalance = _a.sent();
                        return [2 /*return*/, bcBalance];
                }
            });
        });
    };
    Api.prototype.getTokenAbi = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var abi;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scannerApi.getTokenAbi(tokenAddress)];
                    case 1:
                        abi = _a.sent();
                        return [2 /*return*/, abi];
                }
            });
        });
    };
    Api.prototype.getContractSourceCode = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scannerApi.getContractSourceCode(tokenAddress)];
                    case 1:
                        sourceCode = _a.sent();
                        return [2 /*return*/, sourceCode];
                }
            });
        });
    };
    Api.prototype.getLatestPrice = function (tokenAddress, slippage, buyAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var latest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api0x.getLatestPrice(tokenAddress, slippage, buyAmount)];
                    case 1:
                        latest = _a.sent();
                        return [2 /*return*/, latest];
                }
            });
        });
    };
    Api.prototype.getLatestSellPrice = function (tokenAddress, slippage, sellAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var sell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api0x.getLatestSellPrice(tokenAddress, slippage, sellAmount)];
                    case 1:
                        sell = _a.sent();
                        return [2 /*return*/, sell];
                }
            });
        });
    };
    Api.prototype.getHolders = function (tokenAddress, lastBlock) {
        return __awaiter(this, void 0, void 0, function () {
            var holders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.covalentApi.getHolders(tokenAddress, lastBlock)];
                    case 1:
                        holders = _a.sent();
                        return [2 /*return*/, holders];
                }
            });
        });
    };
    Api.prototype.getTopHolder = function (tokenAddress, lastBlock) {
        return __awaiter(this, void 0, void 0, function () {
            var topHolder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.covalentApi.getTopHolder(tokenAddress, lastBlock)];
                    case 1:
                        topHolder = _a.sent();
                        return [2 /*return*/, topHolder];
                }
            });
        });
    };
    Api.prototype.getTransactionsForAddress = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.covalentApi.getTransactionsForAddress(tokenAddress)];
                    case 1:
                        transactions = _a.sent();
                        return [2 /*return*/, transactions];
                }
            });
        });
    };
    Api.prototype.listenForLiquidityAdd = function (baseCurrencyAddress, pairAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var didSet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.listenForLiquidityAdd(baseCurrencyAddress, pairAddress)];
                    case 1:
                        didSet = _a.sent();
                        return [2 /*return*/, didSet];
                }
            });
        });
    };
    Api.prototype.listenForPairCreated = function (lastBlock, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var didSet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.listenForPairCreated(lastBlock, callback)];
                    case 1:
                        didSet = _a.sent();
                        return [2 /*return*/, didSet];
                }
            });
        });
    };
    Api.prototype.subscribeToTransferEvents = function (tokenInterface, tokenAddress, pairAddress, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var didSet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.subscribeToTransferEvents(tokenInterface, tokenAddress, pairAddress, callback)];
                    case 1:
                        didSet = _a.sent();
                        return [2 /*return*/, didSet];
                }
            });
        });
    };
    Api.prototype.subscribeToTransfers = function (tokenAddress, pairAddress, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var didSet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.subscribeToTransfers(tokenAddress, pairAddress, callback)];
                    case 1:
                        didSet = _a.sent();
                        return [2 /*return*/, didSet];
                }
            });
        });
    };
    Api.prototype.unsubscribeFrom = function (subscription) {
        return __awaiter(this, void 0, void 0, function () {
            var unsub;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.unsubscribeFrom(subscription)];
                    case 1:
                        unsub = _a.sent();
                        return [2 /*return*/, unsub];
                }
            });
        });
    };
    Api.prototype.getTransferSubByAddress = function (tokenAddress) {
        var sub = this.web3.getTransferSubByAddress(tokenAddress);
        return sub;
    };
    Api.prototype.getTokenInterface = function (tokenAddress, tokenAbi) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenInterface;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.getTokenInterface(tokenAddress, tokenAbi)];
                    case 1:
                        tokenInterface = _a.sent();
                        return [2 /*return*/, tokenInterface];
                }
            });
        });
    };
    Api.prototype.getPairBaseCurrencyBalanceWeb3 = function (pairInterface, pairAddress, tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.getPairBaseCurrencyBalance(pairInterface, pairAddress, tokenAddress)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    Api.prototype.getTokenName = function (tokenInterface) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.getTokenName(tokenInterface)];
                    case 1:
                        tokenName = _a.sent();
                        return [2 /*return*/, tokenName];
                }
            });
        });
    };
    Api.prototype.getTokenDecimals = function (tokenInterface) {
        return __awaiter(this, void 0, void 0, function () {
            var decimals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.getTokenDecimals(tokenInterface)];
                    case 1:
                        decimals = _a.sent();
                        return [2 /*return*/, decimals];
                }
            });
        });
    };
    Api.prototype.getTokenSymbol = function (tokenInterface) {
        return __awaiter(this, void 0, void 0, function () {
            var symbol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.getTokenSymbol(tokenInterface)];
                    case 1:
                        symbol = _a.sent();
                        return [2 /*return*/, symbol];
                }
            });
        });
    };
    Api.prototype.getBlockWeb3 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.getBlockNumber()];
                    case 1:
                        block = _a.sent();
                        return [2 /*return*/, block];
                }
            });
        });
    };
    return Api;
}());
exports["default"] = Api;
