import { Observable } from "rxjs";

import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { activeContext } from "./../boot";

@Injectable()
export class RequiresActiveContextGuard implements CanActivate {
	constructor( protected router:Router ) {}

	canActivate( route:ActivatedRouteSnapshot, state:RouterStateSnapshot ):Observable<boolean> | Promise<boolean> | boolean {
		return activeContext.promise.then( () => {
			return true;
		} ).catch( ( error ) => {
			if( typeof route.data === "object" && route.data !== null && typeof route.data[ "onReject" ] !== "undefined" ) {
				this.router.navigate( route.data[ "onReject" ] );
			} else {
				console.error( "RequiresActiveContextGuard was configured in a route without an 'onReject' property" );
			}

			return false;
		} );
	}
}
