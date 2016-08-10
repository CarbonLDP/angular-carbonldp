import { ComponentInstruction } from "@angular/router-deprecated";
import { SecurityAnnotation } from "./SecurityAnnotation";
export declare abstract class AbstractSecurityAnnotation implements SecurityAnnotation {
    private _evaluate;
    evaluate: (next: ComponentInstruction, previous: ComponentInstruction) => Promise<boolean> | boolean;
}
