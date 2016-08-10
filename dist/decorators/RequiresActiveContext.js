"use strict";
var router_deprecated_1 = require("@angular/router-deprecated");
var boot_1 = require("./../boot");
var CanActivateUtils_1 = require("./CanActivateUtils");
var RequiresActiveContextAnnotation = (function () {
    function RequiresActiveContextAnnotation(options) {
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
}());
exports.RequiresActiveContext = CanActivateUtils_1.makeCanActivateChainableDecorator(RequiresActiveContextAnnotation);

//# sourceMappingURL=RequiresActiveContext.js.map
