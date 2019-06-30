import { Injector } from "@angular/core";

import * as Cookies from "js-cookie";

import { Class as Carbon } from "carbonldp/Carbon";
import Context from "carbonldp/Context";
import * as Errors from "carbonldp/Errors";
import * as HTTP from "carbonldp/HTTP";
import * as Token from "carbonldp/Auth/Token";

export const AUTH_COOKIE:string = "carbon-token";

let carbon:Carbon = new Carbon( "example.com" );


/**
 * Function that holds the app's injector. To initialize it, call it passing appRef.injector as a parameter.
 * After that, you can import the function and execute it to receive the same injector.
 * @type {function(Injector=): Injector}
 */
const appInjectorFn:( injector?:Injector ) => Promise<Injector> = (():( injector?:Injector ) => Promise<Injector> => {
	let appInjector:Injector;

	let resolve:( injector:Injector ) => void;
	let reject:( error:any ) => void;
	let promise:Promise<Injector> = new Promise( ( _resolve:( injector:Injector ) => void, _reject:( error:any ) => void ) => {
		resolve = _resolve;
		reject = _reject;
	} );

	setTimeout( () => {
		reject( new Error( "appInjector wasn't provided in the configured amount of time" ) );
	}, 10 * 1000 );

	return ( injector?:Injector ):Promise<Injector> => {
		if( injector ) {
			appInjector = injector;
			resolve( injector );
		}

		return promise;
	};
})();

export {
	appInjectorFn as appInjector
};

export function inject( token:any ):Promise<any> {
	return appInjectorFn().then( ( injector:Injector ) => {
		return injector.get( token );
	} );
}

function authenticationCookieIsPresent():boolean {
	return typeof Cookies.get( AUTH_COOKIE ) !== "undefined";
}

function authenticateWithCookie( carbon:Carbon ):Promise<any> {
	let token:Token.Class;
	try {
		token = Cookies.getJSON( AUTH_COOKIE );
	} catch( error ) {
		return Promise.reject( error );
	}
	return carbon.auth.authenticateUsing( "TOKEN", token ).catch( ( error ) => {
		if( error instanceof Errors.IllegalArgumentError || error instanceof HTTP.Errors.UnauthorizedError ) {
			// Invalid token
			Cookies.remove( AUTH_COOKIE );
		} else return Promise.reject( error );
	} );
}

export interface CarbonProviderFn {
	():Context;
	promise?:Promise<void>;
	initialize?:( carbon:Carbon ) => Promise<void>;
}

const carbonProviderFn:CarbonProviderFn = (():CarbonProviderFn => {
	let _carbonProvider:Carbon = null;

	let carbonProviderFn:CarbonProviderFn = ():Carbon => {
		return _carbonProvider;
	};
	carbonProviderFn.promise = Promise.resolve();
	carbonProviderFn.initialize = ( configuredCarbon:Carbon = new Carbon( "example.com" ) ):Promise<void> => {
		_carbonProvider = carbon = configuredCarbon;
		carbonProviderFn.promise.then( () => {
			if( authenticationCookieIsPresent() ) {
				return authenticateWithCookie( carbon );
			}
		} );
		return carbonProviderFn.promise;
	};

	return carbonProviderFn;
})();

export {
	carbonProviderFn as carbonProvider
};

export function aotCarbonFactory():Context {
	return carbon;
}

export const CARBON_PROVIDERS:any[] = [
	{
		provide: Carbon,
		useFactory: aotCarbonFactory,
	},
];
