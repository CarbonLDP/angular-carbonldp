import { Observable } from "rxjs";
import { Router, Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Class as Carbon } from "carbonldp/Carbon";
export declare class CarbonProviderResolver implements Resolve<Carbon> {
    protected router: Router;
    constructor(router: Router);
    resolve(route: ActivatedRouteSnapshot): Observable<Carbon> | Promise<Carbon> | Carbon;
}
