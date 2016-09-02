import { OpaqueToken, EventEmitter } from "@angular/core";

export interface Class {
	loggedInEmitter:EventEmitter<any>;
	loggedOutEmitter:EventEmitter<any>;
	authChangedEmitter:EventEmitter<any>;

	isAuthenticated():boolean;

	login( username:string, password:string, rememberMe:boolean ):Promise<any>;

	logout():void;

	register( name:string, username:string, password:string ):Promise<any>;
	register( name:string, username:string, password:string, slug:string ):Promise<any>;
}

export const Token = new OpaqueToken( "AuthService" );
