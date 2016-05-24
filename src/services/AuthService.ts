import { OpaqueToken, EventEmitter } from "@angular/core";

export interface Class {
	loggedInEmitter:EventEmitter<any>;
	loggedOutEmitter:EventEmitter<any>;
	authChangedEmitter:EventEmitter<any>;

	isAuthenticated():boolean;

	login( username:string, password:string, rememberMe:boolean ):Promise<any>;

	logout():void;
}

export const Token = new OpaqueToken( "AuthService" );
