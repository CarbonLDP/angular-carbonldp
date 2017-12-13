import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { AbstractAuthenticationGuard } from "./abstract-authentication.guard";

@Injectable()
export class NotAuthenticatedGuard extends AbstractAuthenticationGuard {
	constructor( protected router:Router ) {
		super( router );
	}

	canActivate( route:ActivatedRouteSnapshot, state:RouterStateSnapshot ):Promise<boolean> {
		return super.canActivate( route, state ).then( ( canActivate:boolean ) => {
			if( ! canActivate ) return false;
			if( ! this.authService.isAuthenticated() ) return true;
			else return this.onReject( route, state );
		} ).catch( () => {
			return this.onError( route, state );
		} );
	}
}
