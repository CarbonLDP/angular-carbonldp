import { Observable } from "rxjs";

import { Injectable } from "@angular/core";
import { Router, Resolve, ActivatedRouteSnapshot } from "@angular/router";

import { Class as Carbon } from "carbonldp/Carbon";

import { carbonProvider } from "./../boot";

@Injectable()
export class CarbonProviderResolver implements Resolve<Carbon> {
	constructor( protected router:Router ) {}

	resolve( route:ActivatedRouteSnapshot ):Observable<Carbon> | Promise<Carbon> | Carbon {
		return carbonProvider.promise.then( () => {
			return carbonProvider();
		} ).catch( ( error ) => {
			if( typeof route.data === "object" && route.data !== null && typeof route.data[ "onError" ] !== "undefined" ) {
				this.router.navigate( route.data[ "onError" ] );
			} else {
				console.error( "CarbonProviderResolver was configured in a route without an 'data.onError' property" );
			}

			return false;
		} );
	}
}
