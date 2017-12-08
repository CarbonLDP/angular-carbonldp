import { Observable } from "rxjs";

import { Injectable } from "@angular/core";
import { Router, Resolve, ActivatedRouteSnapshot } from "@angular/router";

import Context from "carbonldp/Context";

import { carbonProvider } from "./../boot";

@Injectable()
export class CarbonProviderResolver implements Resolve<boolean | Context> {
	constructor( protected router:Router ) {}

	resolve( route:ActivatedRouteSnapshot ):Observable<Context | boolean> | Promise<Context | boolean> | Context | boolean {
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
