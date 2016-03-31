"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var router_1 = require("angular2/router");
var boot_1 = require("./../boot");
var services_1 = require("./../services");
var AbstractSecurityAnnotation_1 = require("./AbstractSecurityAnnotation");
var CanActivateUtils_1 = require("./CanActivateUtils");
var NotAuthenticatedAnnotation = (function (_super) {
    __extends(NotAuthenticatedAnnotation, _super);
    function NotAuthenticatedAnnotation(options) {
        _super.call(this);
        this.evaluate = function (next, previous) {
            var authService = boot_1.inject(services_1.AuthService.Token);
            var router = boot_1.inject(router_1.Router);
            var isAuthenticated = authService.isAuthenticated();
            if (isAuthenticated && previous === null)
                router.navigate(options.redirectTo);
            return !isAuthenticated;
        };
    }
    return NotAuthenticatedAnnotation;
}(AbstractSecurityAnnotation_1.AbstractSecurityAnnotation));
exports.NotAuthenticated = CanActivateUtils_1.makeCanActivateChainableDecorator(NotAuthenticatedAnnotation);

//# sourceMappingURL=NotAuthenticated.js.map
