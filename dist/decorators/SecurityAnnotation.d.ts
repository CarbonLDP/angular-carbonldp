import { ComponentInstruction } from "@angular/router-deprecated";
export interface SecurityAnnotation {
    evaluate(next: ComponentInstruction, previous: ComponentInstruction): Promise<boolean> | boolean;
}
