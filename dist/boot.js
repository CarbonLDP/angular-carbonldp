"use strict";
var core_1 = require("@angular/core");
var Cookies = require("js-cookie");
var Carbon_1 = require("carbonldp/Carbon");
var App = require("carbonldp/App");
var Errors = require("carbonldp/Errors");
var HTTP = require("carbonldp/HTTP");
exports.AUTH_COOKIE = "carbon-token";
var carbon = new Carbon_1.Class();
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
function authenticateWithCookie(context) {
    var token;
    try {
        token = Cookies.getJSON(exports.AUTH_COOKIE);
    }
    catch (error) {
        return Promise.reject(error);
    }
    return context.auth.authenticateUsing("TOKEN", token).catch(function (error) {
        if (error instanceof Errors.IllegalArgumentError || error instanceof HTTP.Errors.UnauthorizedError) {
            // Invalid token
            Cookies.remove(exports.AUTH_COOKIE);
        }
        else
            return Promise.reject(error);
    });
}
var activeContextFn = (function () {
    var _activeContext = null;
    var _isAppContext = false;
    var activeContextFn = function () {
        return _activeContext;
    };
    activeContextFn.promise = Promise.resolve();
    activeContextFn.initialize = function (configuredCarbon, appSlug) {
        if (configuredCarbon === void 0) { configuredCarbon = new Carbon_1.Class(); }
        if (appSlug === void 0) { appSlug = null; }
        carbon = configuredCarbon;
        var contextPromise = null;
        if (appSlug === null) {
            _activeContext = carbon;
            contextPromise = activeContextFn.promise;
        }
        else {
            _isAppContext = true;
            contextPromise = carbon.apps.getContext(appSlug).then(function (context) {
                _activeContext = context;
            }).catch(function (error) {
                console.error("Couldn't initialize carbon's app context");
                console.error(error);
                return Promise.reject(error);
            });
        }
        activeContextFn.promise = contextPromise.then(function () {
            if (authenticationCookieIsPresent()) {
                return authenticateWithCookie(_activeContext);
            }
        });
        return activeContextFn.promise;
    };
    activeContextFn.isAppContext = function () {
        return _isAppContext;
    };
    return activeContextFn;
})();
exports.activeContext = activeContextFn;
exports.ContextToken = new core_1.OpaqueToken("ContextToken");
function aotCarbonFactory() {
    return carbon;
}
exports.aotCarbonFactory = aotCarbonFactory;
function aotActiveContextFnFactory() {
    return activeContextFn();
}
exports.aotActiveContextFnFactory = aotActiveContextFnFactory;
function aotAppContextFactory() {
    if (!activeContextFn.isAppContext())
        throw new Errors.IllegalStateError("The activeContext is not an App Context");
    return activeContextFn();
}
exports.aotAppContextFactory = aotAppContextFactory;
exports.CARBON_PROVIDERS = [
    {
        provide: Carbon_1.Class,
        useFactory: aotCarbonFactory,
    },
    {
        provide: exports.ContextToken,
        useFactory: aotActiveContextFnFactory,
    },
    {
        provide: App.Context,
        useFactory: aotAppContextFactory,
    },
];
