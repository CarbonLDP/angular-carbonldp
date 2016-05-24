"use strict";

const fs = require( "fs" );
const del = require( "del" );
const packageJSON = require( "./package.json" );

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

gulp.task( "ts-lint", () => {
	return gulp.src( config.source.typescript )
		.pipe( tslint({
			tslint: require( "tslint" )
		}) )
		.pipe( tslint.report( "prose" ) )
		;
});

gulp.task( "bundle-definitions", [ "bundle-definitions:tsconfig-creation", "bundle-definitions:bundling", "bundle-definitions:cleaning" ] );
gulp.task( "bundle-definitions:tsconfig-creation", ( done ) => {
	glob( "src/**", ( error, files ) => {
		files = files.filter( ( file ) => {
			return config.source.typescript.reduce( ( previous, current ) => previous && minimatch( file, current ), true );
		});
		files = files.map( ( file ) => file.replace( "src/", "" ) );

		gulp.src( "./tsconfig.json" )
			.pipe( jeditor( (json) => {
				delete json.exclude;

				json.files = files;

				return json;
			} ) )
			.pipe( gulp.dest( "./src" ) )
			.on( "end", done )
		;
	});
});
gulp.task( "bundle-definitions:bundling", [ "bundle-definitions:tsconfig-creation" ], ( done ) => {
	dts.default({
		name: packageJSON.name,
		project: "src/",
		out: "dist/index.d.ts"
	}).then( () => {
		done();
	});
});
gulp.task( "bundle-definitions:cleaning", [ "bundle-definitions:bundling" ], () => {
	return del( [ "./src/tsconfig.json" ] );
});

gulp.task( "compile-library", () => {
	let tsProject = ts.createProject( "tsconfig.json", {
		"declaration": true
	});

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
});

gulp.task( "clean:dist", ( done ) => {
	return del( config.dist.all, done );
});

gulp.task( "lint", [ "ts-lint" ] );

gulp.task( "prepare-npm-package", () => {
	return gulp.src( [
		"package.json",
	    "README.md",
	    "CHANGELOG.md",
	] ).pipe( gulp.dest( config.dist.tsOutput ) );
});

gulp.task( "build", [ "clean:dist" ], ( done ) => {
	runSequence(
		"clean:dist",
		[ "compile-library", "bundle-definitions", "prepare-npm-package" ],
		done
	);
});
