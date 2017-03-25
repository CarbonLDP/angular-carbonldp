"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var abstract_authentication_guard_1 = require("./abstract-authentication.guard");
var AuthenticatedGuard = (function (_super) {
    __extends(AuthenticatedGuard, _super);
    function AuthenticatedGuard(router) {
        _super.call(this, router);
        this.router = router;
    }
    AuthenticatedGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return _super.prototype.canActivate.call(this, route, state).then(function (canActivate) {
            if (canActivate) {
                if (_this.authService.isAuthenticated())
                    return true;
                else
                    return _this.onReject(route, state);
            }
            else
                return false;
        }).catch(function () {
            return _this.onError(route, state);
        });
    };
    AuthenticatedGuard.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    AuthenticatedGuard.ctorParameters = function () { return [
        { type: router_1.Router, },
    ]; };
    return AuthenticatedGuard;
}(abstract_authentication_guard_1.AbstractAuthenticationGuard));
exports.AuthenticatedGuard = AuthenticatedGuard;
