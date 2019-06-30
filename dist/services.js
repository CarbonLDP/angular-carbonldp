"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthService = require("./services/auth.service");
exports.AuthService = AuthService;
var carbon_auth_service_1 = require("./services/carbon-auth.service");
exports.CarbonAuthService = carbon_auth_service_1.CarbonAuthService;
exports.CARBON_SERVICES_PROVIDERS = [
    {
        provide: AuthService.Token,
        useClass: carbon_auth_service_1.CarbonAuthService,
    },
];
