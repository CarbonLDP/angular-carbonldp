import {ComponentInstruction} from "angular2/router";

import {activeContext} from "./../boot";

export abstract class AbstractSecurityAnnotation {
	private _evaluate:( next:ComponentInstruction, previous:ComponentInstruction ) => Promise<boolean> | boolean;
	get evaluate():( next:ComponentInstruction, previous:ComponentInstruction ) => Promise<boolean> | boolean {
		return this._evaluate;
	}
	set evaluate( evaluate:( next:ComponentInstruction, previous:ComponentInstruction ) => Promise<boolean> | boolean ) {
		this._evaluate = ( next:ComponentInstruction, previous:ComponentInstruction ):Promise<boolean> | boolean => {
			return activeContext.promise.then( () => {
				return evaluate( next, previous );
			});
		};
	}
}
