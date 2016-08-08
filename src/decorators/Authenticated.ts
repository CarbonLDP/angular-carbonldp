import { Router, ComponentInstruction } from "@angular/router-deprecated";

import { inject } from "./../boot";
import { AuthService } from "./../services";
import { AbstractSecurityAnnotation } from "./AbstractSecurityAnnotation";
import { makeCanActivateChainableDecorator } from "./CanActivateUtils";

class AuthenticatedAnnotation extends AbstractSecurityAnnotation {
	constructor( options:{ redirectTo:any[] } ) {
		super();
		this.evaluate = function( next:ComponentInstruction, previous:ComponentInstruction ):Promise<boolean> | boolean {
			let authService:AuthService.Class = inject( AuthService.Token );
			let router:Router = inject( Router );

			let isAuthenticated:boolean = authService.isAuthenticated();
			if( ! isAuthenticated && previous === null ) router.navigate( options.redirectTo );

			return isAuthenticated;
		};
	}
}

export let Authenticated:( options:{ redirectTo:any[] } ) => ClassDecorator = makeCanActivateChainableDecorator( AuthenticatedAnnotation );
