"use strict";

const fs = require( "fs" );
const del = require( "del" );

const gulp = require( "gulp" );
const util = require( "gulp-util" );
const runSequence = require( "run-sequence" );

const sourcemaps = require( "gulp-sourcemaps" );
const ts = require( "gulp-typescript" );

const dts = require( "dts-generator" );
const glob = require( "glob" );
const minimatch = require( "minimatch" );
const jeditor = require( "gulp-json-editor" );

const tslint = require( "gulp-tslint" );

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
		[ "compile:typescript", "prepare-npm-package" ],
		done
	);
} );

gulp.task( "compile:typescript", () => {
	let tsProject = ts.createProject( "tsconfig.json", {
		"declaration": true
	} );

	let tsResults = gulp.src( config.source.typescript )
		.pipe( sourcemaps.init() )
		.pipe( ts( tsProject ) );

	tsResults.dts
		.pipe( gulp.dest( config.dist.tsOutput ) )
	;

	return tsResults.js
		.pipe( sourcemaps.write( "." ) )
		.pipe( gulp.dest( config.dist.tsOutput ) )
		;
} );

gulp.task( "clean:dist", ( done ) => {
	return del( config.dist.all, done );
} );

gulp.task( "lint", [ "lint:typescript" ] );

gulp.task( "lint:typescript", () => {
	return gulp.src( config.source.typescript )
		.pipe( tslint( {
			tslint: require( "tslint" )
		} ) )
		.pipe( tslint.report( "prose" ) )
		;
} );

gulp.task( "prepare-npm-package", ( done ) => {
	runSequence(
		[ "prepare-npm-package:copy-docs", "prepare-npm-package:copy-package-json" ],
		done
	);
} );

gulp.task( "prepare-npm-package:copy-docs", () => {
	return gulp.src( [
		"README.md",
		"CHANGELOG.md",
		"LICENSE",
	] ).pipe( gulp.dest( config.dist.tsOutput ) );
} );

gulp.task( "prepare-npm-package:copy-package-json", () => {
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
		[ "compile:styles", "compile:templates", "compile:typescript" ],
		[ "watch:styles", "watch:templates", "watch:typescript" ],
		done
	);
} );

gulp.task( "watch:typescript", () => {
	return gulp.watch( config.source.typescript, [ "compile:typescript" ] );
} );

