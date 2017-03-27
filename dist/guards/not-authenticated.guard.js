"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
NotAuthenticatedGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router])
], NotAuthenticatedGuard);
exports.NotAuthenticatedGuard = NotAuthenticatedGuard;
