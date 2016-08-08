declare namespace Reflect {
	function getOwnMetadata( key:string, object:Object ):any[];
	function defineMetadata( key:string, values:any[], object:Object ):void;
}