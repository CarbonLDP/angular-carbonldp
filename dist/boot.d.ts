import { OpaqueToken, Injector } from "@angular/core";
import { Carbon } from "carbonldp/Carbon";
import * as App from "carbonldp/App";
import Context from "carbonldp/Context";
export declare const AUTH_COOKIE: string;
/**
 * Function that holds the app's injector. To initialize it, call it passing appRef.injector as a parameter.
 * After that, you can import the function and execute it to receive the same injector.
 * @type {function(Injector=): Injector}
 */
declare const appInjectorFn: (injector?: Injector) => Promise<Injector>;
export { appInjectorFn as appInjector };
export declare function inject(token: any): Promise<any>;
export interface ActiveContextFn {
    (): Context;
    promise?: Promise<void>;
    initialize?: (carbon: Carbon, appSlug?: string) => Promise<void>;
    isAppContext?: () => boolean;
}
declare const activeContextFn: ActiveContextFn;
export { activeContextFn as activeContext };
export declare const ContextToken: OpaqueToken;
export declare function aotCarbonFactory(): Context;
export declare function aotActiveContextFnFactory(): Context;
export declare function aotAppContextFactory(): App.Context;
export declare const CARBON_PROVIDERS: any[];
