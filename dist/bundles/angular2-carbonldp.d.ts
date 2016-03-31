declare module 'angular2-carbonldp/boot' {
	import { Provider, Injector, OpaqueToken } from "angular2/core";
	import Carbon from "carbonldp/Carbon";
	import Context from "carbonldp/Context";
	export const AUTH_COOKIE: string; const appInjectorFn: (injector?: Injector) => Injector;
	export { appInjectorFn as appInjector };
	export function inject(token: any): any;
	export interface ActiveContextFn {
	    (): Context;
	    promise?: Promise<void>;
	    initialize?: (carbon: Carbon, appSlug?: string) => Promise<void>;
	    isAppContext?: () => boolean;
	} const activeContextFn: ActiveContextFn;
	export { activeContextFn as activeContext };
	export const ContextToken: OpaqueToken;
	export const CARBON_PROVIDERS: Provider[];

}
declare module 'angular2-carbonldp/decorators/AbstractSecurityAnnotation' {
	import { ComponentInstruction } from "angular2/router";
	export abstract class AbstractSecurityAnnotation {
	    private _evaluate;
	    evaluate: (next: ComponentInstruction, previous: ComponentInstruction) => Promise<boolean> | boolean;
	}

}
declare module 'angular2-carbonldp/services/AuthService' {
	import { OpaqueToken } from "angular2/core";
	export interface Class {
	    isAuthenticated(): boolean;
	    login(username: string, password: string, rememberMe: boolean): Promise<any>;
	    logout(): void;
	}
	export const Token: OpaqueToken;

}
declare module 'angular2-carbonldp/services/AuthServiceImpl' {
	import Context from "carbonldp/Context";
	import * as AuthService from 'angular2-carbonldp/services/AuthService';
	export class AuthServiceImpl implements AuthService.Class {
	    private context;
	    constructor(context: Context);
	    isAuthenticated(): boolean;
	    login(username: string, password: string, rememberMe: boolean): Promise<any>;
	    logout(): void;
	}

}
declare module 'angular2-carbonldp/services' {
	import { Provider } from "angular2/core";
	import * as AuthService from 'angular2-carbonldp/services/AuthService';
	export const CARBON_SERVICES_PROVIDERS: Provider[];
	export { AuthService };

}
declare module 'angular2-carbonldp/decorators/CanActivateUtils' {
	import { AbstractSecurityAnnotation } from 'angular2-carbonldp/decorators/AbstractSecurityAnnotation';
	export function makeCanActivateChainableDecorator(annotationCls: {
	    new (...args: any[]): AbstractSecurityAnnotation;
	}): (...args: any[]) => (cls: any) => any;

}
declare module 'angular2-carbonldp/decorators/Authenticated' {
	export let Authenticated: (options: {
	    redirectTo: any[];
	}) => ClassDecorator;

}
declare module 'angular2-carbonldp/decorators/NotAuthenticated' {
	export let NotAuthenticated: (options: {
	    redirectTo: any[];
	}) => ClassDecorator;

}
declare module 'angular2-carbonldp/decorators/RequiresActiveContext' {
	export let RequiresActiveContext: (options: {
	    redirectTo: any[];
	}) => ClassDecorator;

}
declare module 'angular2-carbonldp/decorators' {
	export * from 'angular2-carbonldp/decorators/AbstractSecurityAnnotation';
	export * from 'angular2-carbonldp/decorators/Authenticated';
	export * from 'angular2-carbonldp/decorators/CanActivateUtils';
	export * from 'angular2-carbonldp/decorators/NotAuthenticated';
	export * from 'angular2-carbonldp/decorators/RequiresActiveContext';

}
/// <reference no-default-lib="true"/>
/// <reference path="./../typings/typings" />
