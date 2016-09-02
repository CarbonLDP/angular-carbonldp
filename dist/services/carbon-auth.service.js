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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var Cookies = require("js-cookie");
var Agent = require("carbonldp/Auth/Agent");
var Context_1 = require("carbonldp/Context");
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
    CarbonAuthService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(boot_1.ContextToken)), 
        __metadata('design:paramtypes', [(typeof (_a = typeof Context_1.default !== 'undefined' && Context_1.default) === 'function' && _a) || Object])
    ], CarbonAuthService);
    return CarbonAuthService;
    var _a;
}());
exports.CarbonAuthService = CarbonAuthService;

//# sourceMappingURL=carbon-auth.service.js.map
