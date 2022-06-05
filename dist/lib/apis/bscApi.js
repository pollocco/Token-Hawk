"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var api_1 = require("./api");
var node_fetch_1 = require("node-fetch");
var keys_json_1 = require("../../../keys.json");
var helpers_1 = require("../controllers/helpers");
var baseCurrency = {
    ticker: "WBNB",
    address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    decimals: 18
};
var web3Settings = {
    walletAddress: keys_json_1.bscKeys.walletAddress,
    walletKey: keys_json_1.bscKeys.walletKey,
    provider: 'wss://speedy-nodes-nyc.moralis.io/ea5a4a202b77694cb5684782/bsc/mainnet/ws'
    // 'wss://bsc-ws-node.nariox.org:443'
};
var excluded = 'BakerySwap,Belt,DODO,DODO_V2,Ellipsis,Mooniswap,MultiHop,Nerve,SushiSwap,'
    + 'Smoothy,ApeSwap,CafeSwap,CheeseSwap,JulSwap,LiquidityProvider,PancakeSwap';
var api0xOptions = {
    rootUrl: "https://bsc.api.0x.org/",
    walletAddress: web3Settings.walletAddress,
    baseCurrencyTicker: baseCurrency.ticker,
    defaultBuyAmount: 100000000000000,
    excludedSources: excluded
};
var covalentApiOptions = {
    chainId: 56,
    apiKey: keys_json_1.sharedKeys.covalentApiKey
};
var badEndpointpairs = [
    '0x55d398326f99059ff775485246999027b3197955'
];
var bscLiquidityLockers = {
    mudra: {
        "name": "mudra",
        "address": '0xae7e6cabad8d80f0b4e1c4dde2a5db7201ef1252',
        "lockerRootUrl": "https://mudra.website/?certificate=yes&type=0&lp=",
        "interface": ""
    },
    pinkLock: {
        "name": "pinkLock",
        "address": '0x7ee058420e5937496f5a2096f04caa7721cf70cc',
        "lockerRootUrl": "https://www.pinksale.finance/#/pinklock/detail/",
        "interface": ""
    }
};
var pairCreationBlacklist = [
    baseCurrency.address,
    '0x55d398326f99059ff775485246999027b3197955',
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    '0xe9e7cea3dedca5984780bafc599bd69add087d56'
];
var BscApi = /** @class */ (function (_super) {
    __extends(BscApi, _super);
    function BscApi() {
        var _this = _super.call(this, 'https://api.bscscan.com/', baseCurrency, web3Settings, keys_json_1.bscKeys.bscScanApiKey, api0xOptions, covalentApiOptions) || this;
        _this.swapRootUrl = "https://pancakeswap.finance/swap?outputCurrency=";
        _this.scannerRootUrl = "https://bscscan.com/";
        _this.honeypotNetwork = "bsc2";
        _this.pairCreationBlacklist = pairCreationBlacklist;
        _this.lockers = bscLiquidityLockers;
        _this.lockers.pinkLock.getInfo = function (pairAddress) { return _this.getPinkLockInfo(pairAddress); };
        _this.lockers.mudra.getInfo = function (pairAddress, lastBlock) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getMudraLogs(pairAddress, lastBlock)];
            });
        }); };
        return _this;
    }
    BscApi.prototype.getPinkLockInterface = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pinkLockImplementationContract, abi, tokenInterface, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pinkLockImplementationContract = '0xb9abf98cab2c8bd2adf8282e52bf659adb0260fe';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, _super.prototype.getTokenAbi.call(this, pinkLockImplementationContract)];
                    case 2:
                        abi = _a.sent();
                        if (!abi) return [3 /*break*/, 4];
                        return [4 /*yield*/, _super.prototype.getTokenInterface.call(this, this.lockers.pinkLock.address, abi)];
                    case 3:
                        tokenInterface = _a.sent();
                        return [2 /*return*/, tokenInterface];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        console.log("getPinkLockInterface: " + e_1);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BscApi.prototype.getPinkLockInfo = function (pairAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, lockInfo, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.lockers.pinkLock.interface) return [3 /*break*/, 2];
                        _a = this.lockers.pinkLock;
                        return [4 /*yield*/, this.getPinkLockInterface()];
                    case 1:
                        _a.interface = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.lockers.pinkLock.interface.methods.getLocksForToken(pairAddress, 0, 0).call()];
                    case 3:
                        lockInfo = _b.sent();
                        return [2 /*return*/, {
                                unlockDate: lockInfo[0].unlockDate,
                                lockUrl: this.lockers.pinkLock.lockerRootUrl + pairAddress
                            }];
                    case 4:
                        e_2 = _b.sent();
                        console.log("getPinkLockInfo: " + e_2);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BscApi.prototype.getMudraLogs = function (pairAddress, fromBlock) {
        return __awaiter(this, void 0, void 0, function () {
            var addLiqEventUrl, addLiqEventReq, addLiqEvent, addLiqEventUrl2, addLiqEventReq2, addLiqEvent2, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        addLiqEventUrl = this.rootUrl + "api?module=logs&action=getLogs"
                            + "&topic0=0x601e52fd7ec7840490f1ae9c376bc3b32f6a6a6aac8dc10db76d87ef0fa45d32"
                            + ("&topic3=0x000000000000000000000000" + pairAddress.slice(2))
                            + ("&fromBlock=" + fromBlock)
                            + ("&apikey=" + this.scannerApiKey);
                        return [4 /*yield*/, node_fetch_1["default"](addLiqEventUrl)];
                    case 1:
                        addLiqEventReq = _a.sent();
                        return [4 /*yield*/, addLiqEventReq.json()];
                    case 2:
                        addLiqEvent = _a.sent();
                        if (!(addLiqEvent.result.length == 0)) return [3 /*break*/, 5];
                        helpers_1.sleep(1000);
                        addLiqEventUrl2 = this.rootUrl + "api?module=logs&action=getLogs"
                            + "&topic0=0x601e52fd7ec7840490f1ae9c376bc3b32f6a6a6aac8dc10db76d87ef0fa45d32"
                            + ("&topic2=0x000000000000000000000000" + pairAddress.slice(2))
                            + ("&fromBlock=" + fromBlock)
                            + "&apikey=" + this.scannerApiKey;
                        return [4 /*yield*/, node_fetch_1["default"](addLiqEventUrl2)];
                    case 3:
                        addLiqEventReq2 = _a.sent();
                        return [4 /*yield*/, addLiqEventReq2.json()];
                    case 4:
                        addLiqEvent2 = _a.sent();
                        if (addLiqEvent2.result.length == 0)
                            return [2 /*return*/, null];
                        else
                            return [2 /*return*/, { unlockDate: parseInt(addLiqEvent2.result[0].data.slice(120), 16), lockUrl: this.lockers.mudra.lockerRootUrl + pairAddress }];
                        return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, {
                            unlockDate: parseInt(addLiqEvent.result[0].data.slice(120), 16),
                            lockUrl: this.lockers.mudra.lockerRootUrl + pairAddress
                        }]; // to hex
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_3 = _a.sent();
                        console.log(e_3);
                        return [2 /*return*/, null];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BscApi.prototype.getRecentPairCreations = function (fromBlock) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var addLiqEventUrl, addLiqEventReq, addLiqEvent, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        addLiqEventUrl = this.rootUrl + "api?module=logs&action=getLogs&fromBlock=" + fromBlock
                            + "&topic0=0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9"
                            + "&apikey=" + this.scannerApiKey;
                        return [4 /*yield*/, node_fetch_1["default"](addLiqEventUrl)];
                    case 1:
                        addLiqEventReq = _b.sent();
                        return [4 /*yield*/, addLiqEventReq.json()];
                    case 2:
                        addLiqEvent = _b.sent();
                        if (!((_a = addLiqEvent === null || addLiqEvent === void 0 ? void 0 : addLiqEvent.result) === null || _a === void 0 ? void 0 : _a.length)) {
                            return [2 /*return*/, null];
                        }
                        else {
                            return [2 /*return*/, addLiqEvent.result];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _b.sent();
                        console.log(e_4);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return BscApi;
}(api_1["default"]));
exports["default"] = BscApi;
