"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var boot_1 = require("./../boot");
var CarbonProviderResolver = (function () {
    function CarbonProviderResolver(router) {
        this.router = router;
    }
    CarbonProviderResolver.prototype.resolve = function (route) {
        var _this = this;
        return boot_1.carbonProvider.promise.then(function () {
            return boot_1.carbonProvider();
        }).catch(function (error) {
            if (typeof route.data === "object" && route.data !== null && typeof route.data["onError"] !== "undefined") {
                _this.router.navigate(route.data["onError"]);
            }
            else {
                console.error("CarbonProviderResolver was configured in a route without an 'data.onError' property");
            }
            return false;
        });
    };
    return CarbonProviderResolver;
}());
CarbonProviderResolver.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
CarbonProviderResolver.ctorParameters = function () { return [
    { type: router_1.Router, },
]; };
exports.CarbonProviderResolver = CarbonProviderResolver;
