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
var RequiresActiveContextGuard = (function () {
    function RequiresActiveContextGuard(router) {
        this.router = router;
    }
    RequiresActiveContextGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return boot_1.activeContext.promise.then(function () {
            return true;
        }).catch(function (error) {
            if (typeof route.data === "object" && route.data !== null && typeof route.data["onReject"] !== "undefined") {
                _this.router.navigate(route.data["onReject"]);
            }
            else {
                console.error("RequiresActiveContextGuard was configured in a route without an 'onReject' property");
            }
            return false;
        });
    };
    RequiresActiveContextGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.Router])
    ], RequiresActiveContextGuard);
    return RequiresActiveContextGuard;
}());
exports.RequiresActiveContextGuard = RequiresActiveContextGuard;

//# sourceMappingURL=requires-active-context.guard.js.map
