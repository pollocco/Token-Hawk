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
var keys_json_1 = require("../../keys.json");
var baseCurrency = {
    ticker: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18
};
var web3Settings = {
    walletAddress: keys_json_1.ethKeys.walletAddress,
    walletKey: keys_json_1.ethKeys.walletKey,
    provider: 'wss://mainnet.infura.io/ws/v3/' + keys_json_1.ethKeys.infuraProjectId
};
var excluded = 'Native,Uniswap,Eth2Dai,Kyber,Curve,LiquidityProvider,MultiBridge,Balancer,Balancer_V2,CREAM,Bancor,'
    + 'MakerPsm,mStable,Mooniswap,MultiHop,Shell,Swerve,SnowSwap,SushiSwap,DODO,DODO_V2,CryptoCom,Linkswap,KyberDMM,'
    + 'Smoothy,Component,Saddle,xSigma,Curve_V2,Lido,ShibaSwap,Clipper';
var api0xOptions = {
    rootUrl: "https://api.0x.org/",
    walletAddress: web3Settings.walletAddress,
    baseCurrencyTicker: baseCurrency.ticker,
    defaultBuyAmount: 0.00001,
    excludedSources: excluded
};
var covalentApiOptions = {
    chainId: 56,
    apiKey: keys_json_1.sharedKeys.covalentApiKey
};
var pairCreationBlacklist = [
    baseCurrency.address,
    '0x55d398326f99059ff775485246999027b3197955',
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    '0xe9e7cea3dedca5984780bafc599bd69add087d56'
];
var EtherApi = /** @class */ (function (_super) {
    __extends(EtherApi, _super);
    function EtherApi() {
        var _this = _super.call(this, 'https://api.etherscan.io/', baseCurrency, web3Settings, keys_json_1.ethKeys.etherScanApiKey, api0xOptions, covalentApiOptions) || this;
        _this.swapRootUrl = "https://app.uniswap.org/#/swap?outputCurrency=";
        _this.scannerRootUrl = "https://etherscan.io/";
        _this.honeypotNetwork = "eth";
        _this.pairCreationBlacklist = pairCreationBlacklist;
        _this.lockers = [];
        return _this;
    }
    EtherApi.prototype.getRecentPairCreations = function (fromBlock) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var addLiqEventUrl, addLiqEventReq, addLiqEvent, e_1;
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
                        e_1 = _b.sent();
                        console.log(e_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return EtherApi;
}(api_1["default"]));
exports["default"] = EtherApi;
