import { OpaqueToken } from "angular2/core";
export interface Class {
    isAuthenticated(): boolean;
    login(username: string, password: string, rememberMe: boolean): Promise<any>;
    logout(): void;
}
export declare const Token: OpaqueToken;
