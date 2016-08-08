import "rxjs";
import { AbstractSecurityAnnotation } from "./AbstractSecurityAnnotation";
export declare function makeCanActivateChainableDecorator(annotationCls: {
    new (...args: any[]): AbstractSecurityAnnotation;
}): (...args: any[]) => (cls: any) => any;
