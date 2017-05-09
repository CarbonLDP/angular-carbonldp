import { Injectable, EventEmitter } from "@angular/core";

import * as Cookies from "js-cookie";

import * as User from "carbonldp/Auth/User";
import { Class as Carbon } from "carbonldp/Carbon";
import * as Token from "carbonldp/Auth/Token";

import { AUTH_COOKIE } from "./../boot";

import * as AuthService from "./auth.service";

@Injectable()
export class CarbonAuthService implements AuthService.Class {
	private _loggedInEmitter:EventEmitter<any>;
	private _loggedOutEmitter:EventEmitter<any>;
	private _authChangedEmitter:EventEmitter<any>;
	private carbon:Carbon;

	get loggedInEmitter():EventEmitter<any> { return this._loggedInEmitter };

	get loggedOutEmitter():EventEmitter<any> { return this._loggedOutEmitter };

	get authChangedEmitter():EventEmitter<any> { return this._authChangedEmitter };

	constructor( carbon:Carbon ) {
		this.carbon = carbon;
		this._loggedInEmitter = new EventEmitter<any>();
		this._loggedOutEmitter = new EventEmitter<any>();
		this._authChangedEmitter = new EventEmitter<any>();

		this.loggedInEmitter.subscribe( ( value:any ) => this.authChangedEmitter.emit( value ) );
		this.loggedOutEmitter.subscribe( ( value:any ) => this.authChangedEmitter.emit( value ) );
	}

	isAuthenticated():boolean {
		return this.carbon.auth.isAuthenticated();
	}

	login( username:string, password:string, rememberMe:boolean ):Promise<any> {
		return this.carbon.auth.authenticate( username, password ).then( ( credentials:Token.Class ) => {
			if( rememberMe ) Cookies.set( AUTH_COOKIE, JSON.stringify( {
				expirationTime: credentials.expirationTime,
				key: credentials.key
			} ) );
			this.loggedInEmitter.emit( null );
			return credentials;
		} );
	}

	logout():void {
		Cookies.remove( AUTH_COOKIE );
		this.carbon.auth.clearAuthentication();
		this.loggedOutEmitter.emit( null );
	}

	register( name:string, username:string, password:string ):Promise<any>;
	register( name:string, username:string, password:string, slug:string ):Promise<any>;
	register( name:string, username:string, password:string, slug?:string ):Promise<any> {
		let user:User.Class = User.Factory.create( name, username, password );
		return this.carbon.auth.users.register( user, slug );
	}
}
