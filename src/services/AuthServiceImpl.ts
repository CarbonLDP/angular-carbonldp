import { Injectable, Inject } from "angular2/core";

import * as Cookies from "js-cookie";

import Context from "carbonldp/Context";
import Credentials from "carbonldp/Auth/Credentials";

import { AUTH_COOKIE, ContextToken } from "./../boot";

import * as AuthService from "./AuthService";

@Injectable()
export class AuthServiceImpl implements AuthService.Class {
	private context:Context;

	constructor( @Inject( ContextToken ) context:Context ) {
		this.context = context;
	}

	isAuthenticated():boolean {
		return this.context.auth.isAuthenticated();
	}

	login( username:string, password:string, rememberMe:boolean ):Promise<any> {
		return this.context.auth.authenticate( username, password ).then( ( credentials:Credentials ) => {
			if( rememberMe ) Cookies.set( AUTH_COOKIE, credentials );
			return credentials;
		});
	}

	logout():void {
		Cookies.remove( AUTH_COOKIE );
		return this.context.auth.clearAuthentication();
	}
}
