import * as AuthService from "./services/auth.service";
import { CarbonAuthService } from "./services/carbon-auth.service";

export const CARBON_SERVICES_PROVIDERS:any[] = [
	{
		provide: AuthService.Token,
		useClass: CarbonAuthService,
	},
];

export {
	AuthService,
	CarbonAuthService
};
