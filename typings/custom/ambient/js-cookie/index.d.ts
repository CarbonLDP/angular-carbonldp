declare module "js-cookie" {
	interface CookieOptions {
		expires?:number | Date;
		path?:string;
		domain?:string;
		secure?:boolean;
	}
	interface CookieMap {
		[ key:string ]:string;
	}
	interface CookieObjectMap {
		[ key:string ]:any;
	}
	function get( key:string ):string;
	function get():CookieMap;
	function getJSON( key:string ):any;
	function getJSON():CookieObjectMap;
	function set( key:string, value:string | Object | Array<any>, options?:CookieOptions ):void;
	function remove( name:string, options?:CookieOptions ):void;
}
