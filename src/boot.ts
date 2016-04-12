import {provide, Provider, Injector, OpaqueToken} from "angular2/core";

import * as Cookies from "js-cookie";

import Carbon from "carbonldp/Carbon";
import * as App from "carbonldp/App";
import Context from "carbonldp/Context";
import * as Errors from "carbonldp/Errors";
import * as Token from "carbonldp/Auth/Token";

export const AUTH_COOKIE:string = "carbon-token";

let carbon:Carbon = null;

/**
 * Function that holds the app's injector. To initialize it, call it passing appRef.injector as a parameter.
 * After that, you can import the function and execute it to receive the same injector.
 * @type {function(Injector=): Injector}
 */
const appInjectorFn:( injector?:Injector ) => Injector = ( ():( injector?:Injector ) => Injector => {
	let appInjector:Injector;
	return ( injector?:Injector ):Injector => {
		if( injector ) appInjector = injector;
		return appInjector;
	};
})();

export {
	appInjectorFn as appInjector
};

export function inject( token:any ):any {
	return appInjectorFn().get( token );
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
		if( error instanceof Errors.IllegalArgumentError ) {
			// Invalid token
			Cookies.remove( AUTH_COOKIE );
		} else return Promise.reject( error );
	});
}

export interface ActiveContextFn {
	():Context;
	promise?:Promise<void>;
	initialize?:( carbon:Carbon, appSlug?:string ) => Promise<void>;
	isAppContext?:() => boolean;
}

const activeContextFn:ActiveContextFn = ( ():ActiveContextFn => {
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
			}).catch( ( error ) => {
				console.error( "Couldn't initialize carbon's app context" );
				console.error( error );
				return Promise.reject( error );
			});
		}

		activeContextFn.promise = contextPromise.then( () => {
			if( authenticationCookieIsPresent() ) {
				return authenticateWithCookie( _activeContext );
			}
		});
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

export const CARBON_PROVIDERS:Provider[] = [
	provide( Carbon, {
		useFactory: ():Context => {
			return carbon;
		},
	} ),
	provide( ContextToken, {
		useFactory: ():Context => {
			return activeContextFn();
		},
	} ),
	provide( App.Context, {
		useFactory: ():App.Context => {
			if( ! activeContextFn.isAppContext() ) throw new Errors.IllegalStateError( "The activeContext is not an App Context" );
			return <any>activeContextFn();
		},
	} ),
];
