import {provide, Provider} from "angular2/core";

import * as AuthService from "./services/AuthService";
import { AuthServiceImpl } from "./services/AuthServiceImpl";

export const CARBON_SERVICES_PROVIDERS:Provider[] = [
	provide( AuthService.Token, {
		useClass: AuthServiceImpl,
	}),
];

export {
	AuthService
};
