"use strict";

const del = require( "del" );
const gulp = require( "gulp" );
const runSequence = require( "run-sequence" );
const jeditor = require( "gulp-json-editor" );
const sourcemaps = require( "gulp-sourcemaps" );
const ts = require( "gulp-typescript" );
const dts = require( "dts-generator" );
const exec = require( "child_process" ).exec;

let config = {
	source: {
		typescript: [
			"src/**/*.ts",
			"!src/**/*.spec.ts",
		]
	},
	dist: {
		tsOutput: "dist",
		all: "dist/**/*"
	}
};

gulp.task( "default", [ "build" ] );

gulp.task( "build", [ "clean:dist" ], ( done ) => {
	runSequence(
		"clean:dist",
		[ "compile:typescript:aot", "build:prepare-npm-package" ],
		done
	);
} );

gulp.task( "compile:typescript", () => {
	let tsProject = ts.createProject( "tsconfig.json", {
		"declaration": true
	} );

	let tsResults = gulp.src( config.source.typescript )
		.pipe( sourcemaps.init() )
		.pipe( tsProject() );

	tsResults.dts
		.pipe( gulp.dest( config.dist.tsOutput ) );

	return tsResults.js
		.pipe( sourcemaps.write( "." ) )
		.pipe( gulp.dest( config.dist.tsOutput ) );
} );

gulp.task( "compile:typescript:aot", function( cb ) {
	exec( "node_modules/.bin/ngc -p tsconfig.json", function( err, stdout, stderr ) {
		cb( err );
	} );
} );

gulp.task( "clean:dist", ( done ) => {
	return del( config.dist.all, done );
} );

gulp.task( "build:prepare-npm-package", ( done ) => {
	runSequence(
		[ "build:prepare-npm-package:copy:docs", "build:prepare-npm-package:copy:package-json" ],
		done
	);
} );

gulp.task( "build:prepare-npm-package:copy:docs", () => {
	return gulp.src( [
		"README.md",
		"CHANGELOG.md",
		"LICENSE",
	] ).pipe( gulp.dest( config.dist.tsOutput ) );
} );

gulp.task( "build:prepare-npm-package:copy:package-json", () => {
	return gulp.src( "package.json" )
		.pipe( jeditor( ( json ) => {
			delete json.private;
			delete json.scripts;
			delete json.devDependencies;

			json.main = json.main.replace( "dist/", "" );
			json.typings = json.typings.replace( "dist/", "" );

			return json;
		} ) )
		.pipe( gulp.dest( config.dist.tsOutput ) );
} );

gulp.task( "watch", ( done ) => {
	runSequence(
		[ "compile:typescript:aot" ],
		[ "watch:typescript" ],
		done
	);
} );

gulp.task( "watch:typescript", () => {
	return gulp.watch( config.source.typescript, [ "compile:typescript:aot" ] );
} );

