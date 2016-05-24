import { ComponentInstruction } from "@angular/router-deprecated";
export declare abstract class AbstractSecurityAnnotation {
    private _evaluate;
    evaluate: (next: ComponentInstruction, previous: ComponentInstruction) => Promise<boolean> | boolean;
}
