"use strict";
var core_1 = require("angular2/core");
var AuthService = require("./services/AuthService");
exports.AuthService = AuthService;
var AuthServiceImpl_1 = require("./services/AuthServiceImpl");
exports.CARBON_SERVICES_PROVIDERS = [
    core_1.provide(AuthService.Token, {
        useClass: AuthServiceImpl_1.AuthServiceImpl,
    }),
];

//# sourceMappingURL=services.js.map
