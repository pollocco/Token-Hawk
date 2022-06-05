"use strict";
exports.__esModule = true;
var ContractUtils = /** @class */ (function () {
    function ContractUtils() {
    }
    ContractUtils.isCollectable = function (contractSource) {
        if (contractSource.indexOf('collectable') != -1)
            return true;
        else
            return false;
    };
    return ContractUtils;
}());
exports["default"] = ContractUtils;
