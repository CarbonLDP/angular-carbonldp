import { Observable } from "rxjs";
import { Router, Resolve, ActivatedRouteSnapshot } from "@angular/router";
import Context from "carbonldp/Context";
export declare class ActiveContextResolver implements Resolve<Context> {
    protected router: Router;
    constructor(router: Router);
    resolve(route: ActivatedRouteSnapshot): Observable<Context> | Promise<Context> | Context;
}
