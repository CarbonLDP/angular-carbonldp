import "rxjs";

import { CanActivate } from "@angular/router-deprecated/src/lifecycle/lifecycle_annotations_impl";
import { TypeDecorator, Class } from "@angular/core/src/util/decorators";
import { ComponentInstruction } from "@angular/router-deprecated";

import { SecurityAnnotation } from "./SecurityAnnotation";

interface ChainableFn {
	( next:ComponentInstruction, previous:ComponentInstruction ):Promise<boolean> | boolean;
	evaluateFunctions?:Array<( next:ComponentInstruction, previous:ComponentInstruction ) => Promise<boolean> | boolean>;
}

class ChainableCanActivateDecorator extends CanActivate {
	public fn:ChainableFn;

	constructor() {
		let fn:ChainableFn = ( next:ComponentInstruction, previous:ComponentInstruction ):Promise<boolean> | boolean => {
			let promises:Promise<boolean>[] = [];
			for ( let evaluateFunction of fn.evaluateFunctions ) {
				let result:Promise<boolean> | boolean = evaluateFunction( next, previous );
				if( typeof result === "boolean" ) {
					promises.push( Promise.resolve( result ) );
				} else {
					promises.push( result );
				}
			}
			return Promise.all<boolean>( promises ).then( ( results:boolean[] ) => {
				return results.reduce( ( previousValue, current ) => previousValue && current, true );
			} );
		};
		fn.evaluateFunctions = [];
		super( fn );
	}
}

export function makeCanActivateChainableDecorator( annotationCls:{ new( ...args:any[] ):SecurityAnnotation } ):( ...args:any[] ) => ( cls:any ) => any {
	function DecoratorFactory( objOrType:any ):( cls:any ) => any {
		let annotationInstance:SecurityAnnotation = new annotationCls( objOrType );

		if( this instanceof annotationCls ) {
			return <any> annotationInstance;
		} else {
			let chainAnnotation:any[] = typeof this === "undefined" && this.annotations instanceof Array ? this.annotations : [];
			chainAnnotation.push( annotationInstance );

			let typeDecorator:TypeDecorator = <TypeDecorator>function TypeDecorator( cls:any ):any {
				let annotations:any[] = Reflect.getOwnMetadata( "annotations", cls );
				annotations = annotations || [];

				let chainableCanActivateAnnotation:ChainableCanActivateDecorator = annotations.find( ( annotation ) => annotation instanceof ChainableCanActivateDecorator );
				if( typeof chainableCanActivateAnnotation === "undefined" ) {
					chainableCanActivateAnnotation = new ChainableCanActivateDecorator();
					annotations.push( chainableCanActivateAnnotation );
				}

				chainableCanActivateAnnotation.fn.evaluateFunctions.push( annotationInstance.evaluate );

				Reflect.defineMetadata( "annotations", annotations, cls );
				return cls;
			};

			typeDecorator.annotations = chainAnnotation;
			typeDecorator.Class = Class;

			return typeDecorator;
		}
	}

	DecoratorFactory.prototype = Object.create( annotationCls.prototype );
	return DecoratorFactory;
}
