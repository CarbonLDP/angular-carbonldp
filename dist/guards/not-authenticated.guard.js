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
var NotAuthenticatedGuard = (function (_super) {
    __extends(NotAuthenticatedGuard, _super);
    function NotAuthenticatedGuard(router) {
        var _this = _super.call(this, router) || this;
        _this.router = router;
        return _this;
    }
    NotAuthenticatedGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return _super.prototype.canActivate.call(this, route, state).then(function (canActivate) {
            if (canActivate) {
                if (!_this.authService.isAuthenticated())
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
    return NotAuthenticatedGuard;
}(abstract_authentication_guard_1.AbstractAuthenticationGuard));
NotAuthenticatedGuard.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
NotAuthenticatedGuard.ctorParameters = function () { return [
    { type: router_1.Router, },
]; };
exports.NotAuthenticatedGuard = NotAuthenticatedGuard;
