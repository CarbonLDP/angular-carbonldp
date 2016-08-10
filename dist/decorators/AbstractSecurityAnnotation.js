"use strict";
var boot_1 = require("./../boot");
var AbstractSecurityAnnotation = (function () {
    function AbstractSecurityAnnotation() {
    }
    Object.defineProperty(AbstractSecurityAnnotation.prototype, "evaluate", {
        get: function () {
            return this._evaluate;
        },
        set: function (evaluate) {
            this._evaluate = function (next, previous) {
                return boot_1.activeContext.promise.then(function () {
                    return evaluate(next, previous);
                }).catch(function () {
                    return false;
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    return AbstractSecurityAnnotation;
}());
exports.AbstractSecurityAnnotation = AbstractSecurityAnnotation;

//# sourceMappingURL=AbstractSecurityAnnotation.js.map
