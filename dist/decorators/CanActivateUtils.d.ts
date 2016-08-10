import "rxjs";
import { SecurityAnnotation } from "./SecurityAnnotation";
export declare function makeCanActivateChainableDecorator(annotationCls: {
    new (...args: any[]): SecurityAnnotation;
}): (...args: any[]) => (cls: any) => any;
