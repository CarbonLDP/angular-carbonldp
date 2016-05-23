"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var router_deprecated_1 = require("@angular/router-deprecated");
var boot_1 = require("./../boot");
var AbstractSecurityAnnotation_1 = require("./AbstractSecurityAnnotation");
var CanActivateUtils_1 = require("./CanActivateUtils");
var RequiresActiveContextAnnotation = (function (_super) {
    __extends(RequiresActiveContextAnnotation, _super);
    function RequiresActiveContextAnnotation(options) {
        _super.call(this);
        this.evaluate = function (next, previous) {
            var router = boot_1.inject(router_deprecated_1.Router);
            return boot_1.activeContext.promise.then(function () {
                return true;
            }).catch(function (error) {
                router.navigate(options.redirectTo);
                return false;
            });
        };
    }
    return RequiresActiveContextAnnotation;
}(AbstractSecurityAnnotation_1.AbstractSecurityAnnotation));
exports.RequiresActiveContext = CanActivateUtils_1.makeCanActivateChainableDecorator(RequiresActiveContextAnnotation);

//# sourceMappingURL=RequiresActiveContext.js.map
