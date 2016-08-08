"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require("rxjs");
var lifecycle_annotations_impl_1 = require("@angular/router-deprecated/src/lifecycle/lifecycle_annotations_impl");
var decorators_1 = require("@angular/core/src/util/decorators");
var ChainableCanActivateDecorator = (function (_super) {
    __extends(ChainableCanActivateDecorator, _super);
    function ChainableCanActivateDecorator() {
        var fn = function (next, previous) {
            var promises = [];
            for (var _i = 0, _a = fn.evaluateFunctions; _i < _a.length; _i++) {
                var evaluateFunction = _a[_i];
                var result = evaluateFunction(next, previous);
                if (typeof result === "boolean") {
                    promises.push(Promise.resolve(result));
                }
                else {
                    promises.push(result);
                }
            }
            return Promise.all(promises).then(function (results) {
                return results.reduce(function (previousValue, current) { return previousValue && current; }, true);
            });
        };
        fn.evaluateFunctions = [];
        _super.call(this, fn);
    }
    return ChainableCanActivateDecorator;
}(lifecycle_annotations_impl_1.CanActivate));
function makeCanActivateChainableDecorator(annotationCls) {
    function DecoratorFactory(objOrType) {
        var annotationInstance = new annotationCls(objOrType);
        if (this instanceof annotationCls) {
            return annotationInstance;
        }
        else {
            var chainAnnotation = typeof this === "undefined" && this.annotations instanceof Array ? this.annotations : [];
            chainAnnotation.push(annotationInstance);
            var typeDecorator = function TypeDecorator(cls) {
                var annotations = Reflect.getOwnMetadata("annotations", cls);
                annotations = annotations || [];
                var chainableCanActivateAnnotation = annotations.find(function (annotation) { return annotation instanceof ChainableCanActivateDecorator; });
                if (typeof chainableCanActivateAnnotation === "undefined") {
                    chainableCanActivateAnnotation = new ChainableCanActivateDecorator();
                    annotations.push(chainableCanActivateAnnotation);
                }
                chainableCanActivateAnnotation.fn.evaluateFunctions.push(annotationInstance.evaluate);
                Reflect.defineMetadata("annotations", annotations, cls);
                return cls;
            };
            typeDecorator.annotations = chainAnnotation;
            typeDecorator.Class = decorators_1.Class;
            return typeDecorator;
        }
    }
    DecoratorFactory.prototype = Object.create(annotationCls.prototype);
    return DecoratorFactory;
}
exports.makeCanActivateChainableDecorator = makeCanActivateChainableDecorator;

//# sourceMappingURL=CanActivateUtils.js.map
