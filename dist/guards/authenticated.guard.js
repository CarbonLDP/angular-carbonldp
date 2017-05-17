"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var abstract_authentication_guard_1 = require("./abstract-authentication.guard");
var AuthenticatedGuard = (function (_super) {
    __extends(AuthenticatedGuard, _super);
    function AuthenticatedGuard(router) {
        var _this = _super.call(this, router) || this;
        _this.router = router;
        return _this;
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
    return AuthenticatedGuard;
}(abstract_authentication_guard_1.AbstractAuthenticationGuard));
AuthenticatedGuard.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
AuthenticatedGuard.ctorParameters = function () { return [
    { type: router_1.Router, },
]; };
exports.AuthenticatedGuard = AuthenticatedGuard;
