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
var qs = require("qs");
var Api0x = /** @class */ (function () {
    function Api0x(rootUrl, walletAddress, baseCurrencyTicker, defaultBuyAmount, excludedSources) {
        this.rootUrl = rootUrl;
        this.walletAddress = walletAddress;
        this.baseCurrencyTicker = baseCurrencyTicker;
        this.defaultBuyAmount = defaultBuyAmount;
        this.excludedSources = excludedSources;
    }
    Api0x.prototype.getLatestPrice = function (tokenAddress, slippage, sellAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            buyToken: tokenAddress,
                            sellToken: this.baseCurrencyTicker,
                            sellAmount: sellAmount,
                            slippagePercentage: slippage,
                            excludedSources: this.excludedSources
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        url = this.rootUrl + 'swap/v1/' + 'quote?' + qs.stringify(params) // + '&takerAddress=' + this.walletAddress
                        ;
                        return [4 /*yield*/, node_fetch_1["default"](url)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        if (data === null || data === void 0 ? void 0 : data.code) {
                            console.log(data);
                            return [2 /*return*/, null];
                        }
                        else
                            return [2 /*return*/, {
                                    price: data.guaranteedPrice,
                                    buyAmount: data.buyAmount,
                                    sellAmount: data.sellAmount,
                                    gas: data.estimatedGas,
                                    gasPrice: data.gasPrice
                                }];
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Api0x.prototype.getLatestSellPrice = function (tokenAddress, slippage, sellAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response, data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sellToken: tokenAddress,
                            buyToken: this.baseCurrencyTicker,
                            sellAmount: sellAmount,
                            slippagePercentage: slippage,
                            excludedSources: this.excludedSources
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        url = this.rootUrl + 'swap/v1/' + 'quote?' + qs.stringify(params) // + '&takerAddress=' + this.walletAddress
                        ;
                        console.log(url);
                        return [4 /*yield*/, node_fetch_1["default"](url)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        if (data === null || data === void 0 ? void 0 : data.code) {
                            console.log(data);
                            return [2 /*return*/, null];
                        }
                        else
                            return [2 /*return*/, {
                                    price: data.guaranteedPrice,
                                    buyAmount: data.buyAmount,
                                    sellAmount: data.sellAmount,
                                    gas: data.estimatedGas,
                                    gasPrice: data.gasPrice
                                }];
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Api0x;
}());
exports["default"] = Api0x;
