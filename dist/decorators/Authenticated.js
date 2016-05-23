"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var router_deprecated_1 = require("@angular/router-deprecated");
var boot_1 = require("./../boot");
var services_1 = require("./../services");
var AbstractSecurityAnnotation_1 = require("./AbstractSecurityAnnotation");
var CanActivateUtils_1 = require("./CanActivateUtils");
var AuthenticatedAnnotation = (function (_super) {
    __extends(AuthenticatedAnnotation, _super);
    function AuthenticatedAnnotation(options) {
        _super.call(this);
        this.evaluate = function (next, previous) {
            var authService = boot_1.inject(services_1.AuthService.Token);
            var router = boot_1.inject(router_deprecated_1.Router);
            var isAuthenticated = authService.isAuthenticated();
            if (!isAuthenticated && previous === null)
                router.navigate(options.redirectTo);
            return isAuthenticated;
        };
    }
    return AuthenticatedAnnotation;
}(AbstractSecurityAnnotation_1.AbstractSecurityAnnotation));
exports.Authenticated = CanActivateUtils_1.makeCanActivateChainableDecorator(AuthenticatedAnnotation);

//# sourceMappingURL=Authenticated.js.map
