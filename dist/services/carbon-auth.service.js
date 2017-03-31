"use strict";
var core_1 = require("@angular/core");
var Cookies = require("js-cookie");
var Agent = require("carbonldp/Auth/Agent");
var boot_1 = require("./../boot");
var CarbonAuthService = (function () {
    function CarbonAuthService(context) {
        var _this = this;
        this.context = context;
        this._loggedInEmitter = new core_1.EventEmitter();
        this._loggedOutEmitter = new core_1.EventEmitter();
        this._authChangedEmitter = new core_1.EventEmitter();
        this.loggedInEmitter.subscribe(function (value) { return _this.authChangedEmitter.emit(value); });
        this.loggedOutEmitter.subscribe(function (value) { return _this.authChangedEmitter.emit(value); });
    }
    Object.defineProperty(CarbonAuthService.prototype, "loggedInEmitter", {
        get: function () { return this._loggedInEmitter; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CarbonAuthService.prototype, "loggedOutEmitter", {
        get: function () { return this._loggedOutEmitter; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CarbonAuthService.prototype, "authChangedEmitter", {
        get: function () { return this._authChangedEmitter; },
        enumerable: true,
        configurable: true
    });
    ;
    CarbonAuthService.prototype.isAuthenticated = function () {
        return this.context.auth.isAuthenticated();
    };
    CarbonAuthService.prototype.login = function (username, password, rememberMe) {
        var _this = this;
        return this.context.auth.authenticate(username, password).then(function (credentials) {
            if (rememberMe)
                Cookies.set(boot_1.AUTH_COOKIE, JSON.stringify({
                    expirationTime: credentials.expirationTime,
                    key: credentials.key
                }));
            _this.loggedInEmitter.emit(null);
            return credentials;
        });
    };
    CarbonAuthService.prototype.logout = function () {
        Cookies.remove(boot_1.AUTH_COOKIE);
        this.context.auth.clearAuthentication();
        this.loggedOutEmitter.emit(null);
    };
    CarbonAuthService.prototype.register = function (name, username, password, slug) {
        var agent = Agent.Factory.create(name, username, password);
        return this.context.auth.agents.register(agent, slug);
    };
    return CarbonAuthService;
}());
CarbonAuthService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
CarbonAuthService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core_1.Inject, args: [boot_1.ContextToken,] },] },
]; };
exports.CarbonAuthService = CarbonAuthService;
