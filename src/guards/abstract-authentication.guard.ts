import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from "@angular/router";

import { inject, activeContext } from "./../boot";
import { AuthService } from "./../services";

@Injectable()
export abstract class AbstractAuthenticationGuard implements CanActivate {
	protected authService:AuthService.Class;

	constructor( protected router:Router ) {}

	canActivate( route:ActivatedRouteSnapshot, state:RouterStateSnapshot ):Promise<boolean> {
		return activeContext.promise.then( () => {
			// AuthService needs to be injected here so we don't cause a premature initialization of AuthService
			// If AuthService is injected in the constructor, the activeContext won't be ready and will cause an error
			this.authService = inject( AuthService.Token );
			return true;
		} ).catch( ( error ) => {
			return this.onError( route, state );
		} );
	}

	protected onReject( route:ActivatedRouteSnapshot, state:RouterStateSnapshot ):boolean {
		if( typeof route.data === "object" && route.data !== null && typeof route.data[ "onReject" ] !== "undefined" ) {
			this.router.navigate( route.data[ "onReject" ] );
		} else {
			console.error( "AuthenticatedGuard was configured in a route without an 'onReject' property" );
		}
		return false;
	}

	protected onError( route:ActivatedRouteSnapshot, state:RouterStateSnapshot ):boolean {
		if( typeof route.data === "object" && route.data !== null && typeof route.data[ "onError" ] !== "undefined" ) {
			this.router.navigate( route.data[ "onError" ] );
		} else {
			return this.onReject( route, state );
		}
		return false;
	}
}
