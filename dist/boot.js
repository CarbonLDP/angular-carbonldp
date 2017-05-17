"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cookies = require("js-cookie");
var Carbon_1 = require("carbonldp/Carbon");
var Errors = require("carbonldp/Errors");
var HTTP = require("carbonldp/HTTP");
exports.AUTH_COOKIE = "carbon-token";
var carbon = new Carbon_1.Class("example.com");
/**
 * Function that holds the app's injector. To initialize it, call it passing appRef.injector as a parameter.
 * After that, you can import the function and execute it to receive the same injector.
 * @type {function(Injector=): Injector}
 */
var appInjectorFn = (function () {
    var appInjector;
    var resolve;
    var reject;
    var promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });
    setTimeout(function () {
        reject(new Error("appInjector wasn't provided in the configured amount of time"));
    }, 10 * 1000);
    return function (injector) {
        if (injector) {
            appInjector = injector;
            resolve(injector);
        }
        return promise;
    };
})();
exports.appInjector = appInjectorFn;
function inject(token) {
    return appInjectorFn().then(function (injector) {
        return injector.get(token);
    });
}
exports.inject = inject;
function authenticationCookieIsPresent() {
    return typeof Cookies.get(exports.AUTH_COOKIE) !== "undefined";
}
function authenticateWithCookie(carbon) {
    var token;
    try {
        token = Cookies.getJSON(exports.AUTH_COOKIE);
    }
    catch (error) {
        return Promise.reject(error);
    }
    return carbon.auth.authenticateUsing("TOKEN", token).catch(function (error) {
        if (error instanceof Errors.IllegalArgumentError || error instanceof HTTP.Errors.UnauthorizedError) {
            // Invalid token
            Cookies.remove(exports.AUTH_COOKIE);
        }
        else
            return Promise.reject(error);
    });
}
var carbonProviderFn = (function () {
    var _carbonProvider = null;
    var carbonProviderFn = function () {
        return _carbonProvider;
    };
    carbonProviderFn.promise = Promise.resolve();
    carbonProviderFn.initialize = function (configuredCarbon) {
        if (configuredCarbon === void 0) { configuredCarbon = new Carbon_1.Class("example.com"); }
        _carbonProvider = carbon = configuredCarbon;
        carbonProviderFn.promise.then(function () {
            if (authenticationCookieIsPresent()) {
                return authenticateWithCookie(carbon);
            }
        });
        return carbonProviderFn.promise;
    };
    return carbonProviderFn;
})();
exports.carbonProvider = carbonProviderFn;
function aotCarbonFactory() {
    return carbon;
}
exports.aotCarbonFactory = aotCarbonFactory;
exports.CARBON_PROVIDERS = [
    {
        provide: Carbon_1.Class,
        useFactory: aotCarbonFactory,
    },
];
