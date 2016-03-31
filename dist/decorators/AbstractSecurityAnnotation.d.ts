import { ComponentInstruction } from "angular2/router";
export declare abstract class AbstractSecurityAnnotation {
    private _evaluate;
    evaluate: (next: ComponentInstruction, previous: ComponentInstruction) => Promise<boolean> | boolean;
}
