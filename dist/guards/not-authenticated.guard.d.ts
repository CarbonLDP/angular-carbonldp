import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AbstractAuthenticationGuard } from "./abstract-authentication.guard";
export declare class NotAuthenticatedGuard extends AbstractAuthenticationGuard {
    protected router: Router;
    constructor(router: Router);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>;
}
