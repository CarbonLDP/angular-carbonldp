import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from "@angular/router";
import { AuthService } from "./../services";
export declare abstract class AbstractAuthenticationGuard implements CanActivate {
    protected router: Router;
    protected authService: AuthService.Class;
    constructor(router: Router);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>;
    protected onReject(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
    protected onError(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
}
