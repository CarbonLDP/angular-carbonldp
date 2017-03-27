"use strict";
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
var boot_1 = require("./../boot");
var services_1 = require("./../services");
var AbstractAuthenticationGuard = (function () {
    function AbstractAuthenticationGuard(router) {
        this.router = router;
    }
    AbstractAuthenticationGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return boot_1.activeContext.promise.then(function () {
            // AuthService needs to be injected here so we don't cause a premature initialization of AuthService
            // If AuthService is injected in the constructor, the activeContext won't be ready and will cause an error
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
AbstractAuthenticationGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router])
], AbstractAuthenticationGuard);
exports.AbstractAuthenticationGuard = AbstractAuthenticationGuard;
