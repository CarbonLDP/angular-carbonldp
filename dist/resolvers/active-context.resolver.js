"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var boot_1 = require("./../boot");
var ActiveContextResolver = (function () {
    function ActiveContextResolver(router) {
        this.router = router;
    }
    ActiveContextResolver.prototype.resolve = function (route) {
        var _this = this;
        return boot_1.activeContext.promise.then(function () {
            return boot_1.activeContext();
        }).catch(function (error) {
            if (typeof route.data === "object" && route.data !== null && typeof route.data["onError"] !== "undefined") {
                _this.router.navigate(route.data["onError"]);
            }
            else {
                console.error("ActiveContextResolver was configured in a route without an 'data.onError' property");
            }
            return false;
        });
    };
    ActiveContextResolver.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    ActiveContextResolver.ctorParameters = function () { return [
        { type: router_1.Router, },
    ]; };
    return ActiveContextResolver;
}());
exports.ActiveContextResolver = ActiveContextResolver;
