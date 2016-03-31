import Context from "carbonldp/Context";
import * as AuthService from "./AuthService";
export declare class AuthServiceImpl implements AuthService.Class {
    private context;
    constructor(context: Context);
    isAuthenticated(): boolean;
    login(username: string, password: string, rememberMe: boolean): Promise<any>;
    logout(): void;
}
