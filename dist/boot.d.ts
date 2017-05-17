import { Injector } from "@angular/core";
import { Class as Carbon } from "carbonldp/Carbon";
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
export interface CarbonProviderFn {
    (): Context;
    promise?: Promise<void>;
    initialize?: (carbon: Carbon) => Promise<void>;
}
declare const carbonProviderFn: CarbonProviderFn;
export { carbonProviderFn as carbonProvider };
export declare function aotCarbonFactory(): Context;
export declare const CARBON_PROVIDERS: any[];
