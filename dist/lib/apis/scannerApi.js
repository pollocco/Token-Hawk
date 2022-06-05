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
var ScannerApi = /** @class */ (function () {
    function ScannerApi(rootUrl, scannerApiKey, baseCurrency) {
        this.rootUrl = rootUrl;
        this.scannerApiKey = scannerApiKey;
        this.baseCurrency = baseCurrency;
    }
    ScannerApi.prototype.getLastBlock = function (timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var tsEdit, lastBlockUrl, blockReq, lastBlock, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tsEdit = timestamp;
                        lastBlockUrl = this.rootUrl + 'api?module=block&action=getblocknobytime'
                            + '&timestamp=' + tsEdit
                            + '&closest=before'
                            + '&apikey=' + this.scannerApiKey;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, node_fetch_1["default"](lastBlockUrl)];
                    case 2:
                        blockReq = _a.sent();
                        return [4 /*yield*/, blockReq.json()];
                    case 3:
                        lastBlock = _a.sent();
                        if (lastBlock.status === "1")
                            return [2 /*return*/, lastBlock.result];
                        else
                            return [2 /*return*/, null];
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
    ScannerApi.prototype.getPairBaseCurrencyBalance = function (pairAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var pairBnbUrl, bnbBalanceReq, bnbBalance, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pairBnbUrl = this.rootUrl + "api?module=account&action=tokenbalance"
                            + ("&contractaddress=" + this.baseCurrency.address)
                            + ("&address=" + pairAddress)
                            + "&tag=latest"
                            + ("&apikey=" + this.scannerApiKey);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, node_fetch_1["default"](pairBnbUrl)];
                    case 2:
                        bnbBalanceReq = _a.sent();
                        return [4 /*yield*/, bnbBalanceReq.json()];
                    case 3:
                        bnbBalance = _a.sent();
                        if (bnbBalance.status === "1")
                            return [2 /*return*/, BigInt(bnbBalance.result)];
                        else
                            return [2 /*return*/, null];
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
    /**
     * Attempts to fetch token ABI using
     * token's API interface. Returns
     * null if no ABI is returned
     * for the token. Otherwise the
     * parsed ABI is returned.
     *
     */
    ScannerApi.prototype.getTokenAbi = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAbiUrl, tokenAbiReq, tokenAbi, tokenAbiParsed, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        tokenAbiUrl = this.rootUrl + "api?module=contract&action=getabi"
                            + ("&address=" + tokenAddress)
                            + ("&apikey=" + this.scannerApiKey);
                        return [4 /*yield*/, node_fetch_1["default"](tokenAbiUrl)];
                    case 1:
                        tokenAbiReq = _a.sent();
                        return [4 /*yield*/, tokenAbiReq.json()];
                    case 2:
                        tokenAbi = _a.sent();
                        if (tokenAbi.result[0] != 'C') {
                            tokenAbiParsed = JSON.parse(tokenAbi.result);
                        }
                        else
                            return [2 /*return*/, null];
                        return [2 /*return*/, tokenAbiParsed];
                    case 3:
                        e_3 = _a.sent();
                        console.log(e_3);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ScannerApi.prototype.getContractSourceCode = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceCodeUrl, sourceCodeReq, sourceCode, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sourceCodeUrl = this.rootUrl + "api?"
                            + "module=contract"
                            + "&action=getsourcecode"
                            + ("&address=" + tokenAddress)
                            + ("&apikey=" + this.scannerApiKey);
                        return [4 /*yield*/, node_fetch_1["default"](sourceCodeUrl)];
                    case 1:
                        sourceCodeReq = _a.sent();
                        return [4 /*yield*/, sourceCodeReq.json()];
                    case 2:
                        sourceCode = _a.sent();
                        if (sourceCode.status === "1")
                            return [2 /*return*/, sourceCode.result[0].SourceCode];
                        else
                            return [2 /*return*/, null];
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        console.log(e_4);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ScannerApi;
}());
exports["default"] = ScannerApi;
