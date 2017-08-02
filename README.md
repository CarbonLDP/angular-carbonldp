# angular-carbonldp

[![npm version](https://badge.fury.io/js/angular-carbonldp.svg)](https://badge.fury.io/js/angular-carbonldp)

[![Build Status](https://travis-ci.org/CarbonLDP/angular-carbonldp.svg)](https://travis-ci.org/CarbonLDP/angular-carbonldp)

Helping classes that simplify the integration between [Angular](https://angular.io/) and [CarbonLDP](https://carbonldp.com/)

## Installation

Install through [npm](https://www.npmjs.com/) using the following command:

```bash
npm install angular-carbonldp
```

## Usage

To use this library, you have to follow three steps:
 1. **Initialization** of your Carbon context
 2. **Provision** of the context to your app
 3. **Injection** of the desired context to your app 

### 1. Initialization

In the bootstrapping file of your Angular application (commonly main.ts),
you need to initialize the active Carbon Platform you are going to use across your application.


#### App Context

The initialization needs to be as follows:

```typescript
import { NgModuleRef } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { CARBON_PROTOCOL, CARBON_HOST, DEBUG } from "app/config";
import { appInjector, carbonProvider } from "angular-carbonldp/boot";

import { Class as Carbon } from "carbonldp/Carbon";
import { AppModule } from "app/app.module";

let carbon:Carbon = new Carbon( CARBON_HOST, CARBON_PROTOCOL === "https" );

// Initialize carbon
carbonProvider.initialize( carbon );

platformBrowserDynamic().bootstrapModule( AppModule ).then( ( appRef:NgModuleRef<AppModule> ) => {
	// Don't forget this line! It gives guards access to DI
	appInjector( appRef.injector );
} ).catch( ( error ) => {
	console.error( error );
} );
```

### 2. Provision

After the **initialization** of your Carbon, you can now proceed to [provide to your main module](https://angular.io/docs/ts/latest/guide/dependency-injection.html#!#sts=Registering%20providers%20in%20an%20NgModule) the Carbon instance.
To do this, the provision needs to be as follows:
 
 ```typescript
 import { NgModule } from "@angular/core";
 import { BrowserModule } from "@angular/platform-browser";
 
 // Providers
 import { CARBON_PROVIDERS } from "angular-carbonldp/boot";
 import { CARBON_SERVICES_PROVIDERS } from "angular-carbonldp/services";
 
 // Components
 import { AppComponent } from "./app.component";
 
 
 @NgModule( {
 	imports: [
 		BrowserModule
 	],
 	declarations: [
 		AppComponent
 	],
 	providers: [
 		CARBON_PROVIDERS,            // <-- This provides the Carbon instace to your app
 		CARBON_SERVICES_PROVIDERS,   // <-- This provides the Carbon authentication services to your app
 	],
 	bootstrap: [ AppComponent ],
 } )
 export class AppModule { }
 ```


### 3. Injection (DI Objects)

After initializing the context and registering the providers, the following objects can be injected:

```typescript
import { Inject } from "@angular/core";

import { Class as Carbon } from "carbonldp/Carbon";
import * as App from "carbonldp/App";
import Context from "carbonldp/Context";

import { ContextToken } from "angular-carbonldp/boot";
import { AuthService } from "angular-carbonldp/services";

// The main carbon Context
constructor( private carbon:Carbon ) {}

// A basic AuthService that handles cookie based sessions
constructor( @Inject( AuthService.Token ) private authService:AuthService.Class ) {}
```

Until here, your app is now integrated with Carbon. You can now make use of Carbon inside your app.

But if you want to use Carbon inside the routes of your app, let's say to allow or forbid routes, you can also use the **Resolvers** and **Guards** that this library provides.


### Resolvers & Guards

#### Resolvers

[Resolvers](https://angular.io/docs/ts/latest/guide/router.html#!#resolve-guard) help you to assure that a desired data will be available before rendering a routed component.
This library provides you the following resolver:

##### CarbonProviderResolver

Resolver that will make sure that Carbon is resolved before activating the route.

It needs a route to redirect the user to in case any errors occur.
```typescript
import { Routes } from "@angular/router";
// Resolvers
import { ActiveContextResolver } from "angular-carbonldp/resolvers";

const appRoutes:Routes = [
	...
	{
        path: "home",
        component: HomeView,
        resolve: {
            activeContext: ActiveContextResolver
        },
        data: {
            onError: [ "/error" ],  // <-- The name of the page to redirect to
        }
	},
	{
		path: "error",
		component: ErrorView,
	},
	...
];
```

#### Guards

[Guards](https://angular.io/docs/ts/latest/guide/router.html#!#guards) help you to continue or block navigation to a given route depending on a condition.
All guards need a route to redirect the user to, if the guard rejects the route activation. This route needs to be
defined in the route's `data.onReject` property.
We provide you the following two guards:

##### AuthenticatedGuard

Guard that will prevent the route from being activated when the user hasn't authenticated himself.

```typescript
import { Routes } from "@angular/router";
// Guards
import { AuthenticatedGuard } from "angular-carbonldp/guards";

const appRoutes:Routes = [
	...
	{
	    path: "secured",
	    component: SecuredView,
	    canActivate: [ AuthenticatedGuard ],
	    data: {
	        onReject: [ "/login" ],
	        onError: [ "/error" ],
	    }
	},
	...
];
```

#### NotAuthenticatedGuard

Guard that will prevent the route from being activated when the user is already authenticated.
```typescript
import { Routes } from "@angular/router";
// Guards
import { NotAuthenticatedGuard } from "angular-carbonldp/guards";

const appRoutes:Routes = [
	...
	{
        path: "login",
        component: LoginView,
        canActivate: [ NotAuthenticatedGuard ],
        data: {
            onReject: [ "/secured" ],
            onError: [ "/error" ],
        }
	},
	...
];
```

## Development

To develop this library you need to have installed the following:
 1. [node.js](https://nodejs.org/es/docs/)
 2. [npm](https://www.npmjs.com)
 
The steps to develop the library are as follows:
 1. `cd` to the project path
 2. `npm install`
 3. `gulp` to bundle the library
 4. `gulp:watch` to watch for changes inside the `src` folder

### Gulp tasks

Gulp defines two tasks:

- `default`: Runs the `build` task
- `build`: Runs the following tasks: `clean:dist`, `compile:typescript:aot`, `build:prepare-npm-package`
- `compile:typescript`: Compiles typescript using the `gulp-typescript` plugin
- `compile:typescript:aot`: Compiles typescript using the `@angular/compiler-cli` ensuring an AOT compliant library
- `clean:dist`: Cleans `dist` directory
- `build:prepare-npm-package`: Prepares publishable npm package inside of the `dist` directory
- `build:prepare-npm-package:copy:docs`: Copies documentation files for the publishable npm package
- `build:prepare-npm-package:copy:package-json`: Copies and prepares the `package.json` file for the publishable npm package
- `watch`: Sets up a service to watch for any change to any source file and run the associated tasks to them. Really useful for development
- `watch:typescript`: Watches for changes in typescript files (ts)

### File structure

    .
    ├── dist                                        # Compiled files
    ├── src                                         # Source files
    │   ├── guards                                  
    │   │   ├── abstract-authentication.guard.ts    # Guard implementing CanActivate
    │   │   ├── authenticated.guard.ts              # Guard preventing access to unauthenticated users
    │   │   └── not-authenticated.guard.ts          # Guard peventing access to authenticated users
    │   ├── resolvers                               
    │   │   └── acitve-context.resolver.ts          # Resolver that checks if there's an activeContext
    │   ├── services                                
    │   │   ├── auth.service.ts                     # Interface and token to use when implementing an Auth Service
    │   │   └── carbon-auth.service.ts              # Service implementing the Auth Service usin Carbon 
    │   ├── boot.ts                                 # Exports appInjectorFn, CARBON_PROVIDERS and activeContext
    │   ├── guards.ts                               # Exports guards
    │   ├── index.ts                                # Exports boot, guards, services and resolvers
    │   ├── resolvers.ts                            # Exports resolvers
    │   └── services.ts                             # Exports services
    ├── gitignore                                   # Ignore file for git
    ├── .travis.yml                                 # Travis configuration file
    ├── CHANGELOG                                   # File to track package changes
    ├── gulpfile.js                                 # Gulp's tasks definition file
    ├── LICENSE
    ├── package.json                                # npm configuration file
    ├── README.md                                   # this
    └── tsconfig.json                               # Typescript and Angular compiler configuration file.


## TODO

- Linting
- Testing

## License

	Copyright (c) 2015-present, Base22 Technology Group, LLC.
	All rights reserved.

	This source code is licensed under the BSD-style license found in the
	LICENSE file in the root directory of this source tree.
