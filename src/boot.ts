import { OpaqueToken, Injector } from "@angular/core";

import * as Cookies from "js-cookie";

import { Class as Carbon } from "carbonldp/Carbon";
import * as App from "carbonldp/App";
import Context from "carbonldp/Context";
import * as Errors from "carbonldp/Errors";
import * as HTTP from "carbonldp/HTTP";
import * as Token from "carbonldp/Auth/Token";

export const AUTH_COOKIE:string = "carbon-token";

let carbon:Carbon = new Carbon();


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

function authenticateWithCookie( context:Context ):Promise<any> {
	let token:Token.Class;
	try {
		token = Cookies.getJSON( AUTH_COOKIE );
	} catch( error ) {
		return Promise.reject( error );
	}
	return context.auth.authenticateUsing( "TOKEN", token ).catch( ( error ) => {
		if( error instanceof Errors.IllegalArgumentError || error instanceof HTTP.Errors.UnauthorizedError ) {
			// Invalid token
			Cookies.remove( AUTH_COOKIE );
		} else return Promise.reject( error );
	} );
}

export interface ActiveContextFn {
	():Context;
	promise?:Promise<void>;
	initialize?:( carbon:Carbon, appSlug?:string ) => Promise<void>;
	isAppContext?:() => boolean;
}

const activeContextFn:ActiveContextFn = (():ActiveContextFn => {
	let _activeContext:Context = null;
	let _isAppContext:boolean = false;

	let activeContextFn:ActiveContextFn = ():Context => {
		return _activeContext;
	};
	activeContextFn.promise = Promise.resolve();
	activeContextFn.initialize = ( configuredCarbon:Carbon = new Carbon(), appSlug:string = null ):Promise<void> => {
		carbon = configuredCarbon;

		let contextPromise:Promise<void> = null;
		if( appSlug === null ) {
			_activeContext = carbon;

			contextPromise = activeContextFn.promise;
		} else {
			_isAppContext = true;

			contextPromise = carbon.apps.getContext( appSlug ).then( ( context:Context ) => {
				_activeContext = context;
			} ).catch( ( error ) => {
				console.error( "Couldn't initialize carbon's app context" );
				console.error( error );
				return Promise.reject( error );
			} );
		}

		activeContextFn.promise = contextPromise.then( () => {
			if( authenticationCookieIsPresent() ) {
				return authenticateWithCookie( _activeContext );
			}
		} );
		return activeContextFn.promise;
	};
	activeContextFn.isAppContext = ():boolean => {
		return _isAppContext;
	};

	return activeContextFn;
})();

export {
	activeContextFn as activeContext
};

export const ContextToken = new OpaqueToken( "ContextToken" );

export function aotCarbonFactory():Context {
	return carbon;
}
export function aotActiveContextFnFactory():Context {
	return activeContextFn();
}
export function aotAppContextFactory():App.Context {
	if( ! activeContextFn.isAppContext() ) throw new Errors.IllegalStateError( "The activeContext is not an App Context" );
	return <any>activeContextFn();
}

export const CARBON_PROVIDERS:any[] = [
	{
		provide: Carbon,
		useFactory: aotCarbonFactory,
	},
	{
		provide: ContextToken,
		useFactory: aotActiveContextFnFactory,
	},
	{
		provide: App.Context,
		useFactory: aotAppContextFactory,
	},
];
