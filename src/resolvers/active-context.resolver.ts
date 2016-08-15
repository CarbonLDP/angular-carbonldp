import { Observable } from "rxjs";

import { Injectable } from "@angular/core";
import { Router, Resolve, ActivatedRouteSnapshot } from "@angular/router";

import Context from "carbonldp/Context";

import { activeContext } from "./../boot";

@Injectable()
export class ActiveContextResolver implements Resolve<Context> {
	constructor( protected router:Router ) {}

	resolve( route:ActivatedRouteSnapshot ):Observable<Context> | Promise<Context> | Context {
		return activeContext.promise.then( () => {
			return activeContext();
		} ).catch( ( error ) => {
			if( typeof route.data === "object" && route.data !== null && typeof route.data[ "onError" ] !== "undefined" ) {
				this.router.navigate( route.data[ "onError" ] );
			} else {
				console.error( "ActiveContextResolver was configured in a route without an 'data.onError' property" );
			}

			return false;
		} );
	}
}
