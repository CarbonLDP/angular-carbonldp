"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var boot_1 = require("./../boot");
var services_1 = require("./../services");
var AbstractAuthenticationGuard = (function () {
    function AbstractAuthenticationGuard(router) {
        this.router = router;
    }
    AbstractAuthenticationGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return boot_1.carbonProvider.promise.then(function () {
            // AuthService needs to be injected here so we don't cause a premature initialization of AuthService
            // If AuthService is injected in the constructor, the carbonProvider won't be ready and will cause an error
            return boot_1.inject(services_1.AuthService.Token);
        }).then(function (authService) {
            _this.authService = authService;
            return true;
        }).catch(function (error) {
            return _this.onError(route, state);
        });
    };
    AbstractAuthenticationGuard.prototype.onReject = function (route, state) {
        if (typeof route.data === "object" && route.data !== null && typeof route.data["onReject"] !== "undefined") {
            this.router.navigate(route.data["onReject"]);
        }
        else {
            console.error("AuthenticatedGuard was configured in a route without an 'onReject' property");
        }
        return false;
    };
    AbstractAuthenticationGuard.prototype.onError = function (route, state) {
        if (typeof route.data === "object" && route.data !== null && typeof route.data["onError"] !== "undefined") {
            this.router.navigate(route.data["onError"]);
        }
        else {
            return this.onReject(route, state);
        }
        return false;
    };
    return AbstractAuthenticationGuard;
}());
AbstractAuthenticationGuard.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
AbstractAuthenticationGuard.ctorParameters = function () { return [
    { type: router_1.Router, },
]; };
exports.AbstractAuthenticationGuard = AbstractAuthenticationGuard;
