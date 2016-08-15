# angular2-carbonldp
Helping classes that simplify the integration between [Angular2](https://angular.io/) and [CarbonLDP](https://carbonldp.com/)

## Initialization
In the file where you are bootstrapping your Angular2 application (commonly boot.ts),
you need to initialize the active Carbon's context you are going to use across your application.

### App Context
If your application is going to use only one App Context (which is normally the case),
the initialization needs to be as follows:

```typescript
import { bootstrap } from "angular2/platform/browser";
import { ComponentRef } from "angular2/core";
import { appInjector, activeContext, CARBON_PROVIDERS } from "angular2-carbonldp/boot";
import { CARBON_SERVICES_PROVIDERS } from "angular2-carbonldp/services";
import Carbon from "carbonldp/Carbon";

let carbon:Carbon = new Carbon();
// Here you can configure this instance of carbon (setSetting, extendObjectSchema, etc.)

activeContext.initialize( carbon, "YOUR-APP-SLUG-GOES-HERE/" );

bootstrap( YourMainComponent, [
    // Your providers...
    
    CARBON_PROVIDERS,
    CARBON_SERVICES_PROVIDERS,
] ).then( ( appRef:ComponentRef ) => {
    // Don't forget this line! It gives decorators access to DI
    appInjector( appRef.injector );
} ).catch( ( error ) => {
    console.error( "Couldn't bootstrap the application" );
    console.error( error );
    return Promise.reject( error );
});
```

### Platform Context
If instead, your web application is going to work with several Carbon App Contexts
(an Advanced use), the initialization would be exactly the same but without providing an app slug:

```typescript
activeContext.initialize( carbon );
```

## DI Objects
After initializing the context and registering the providers, the following objects can be injected:

```typescript
import { Inject } from "angular2/core";

import Carbon from "carbonldp/Carbon";
import * as App from "carbonldp/App";
import Context from "carbonldp/Context";

import { ContextToken } from "angular2-carbonldp/boot";
import { AuthService } from "angular2-carbonldp/services";

// The main carbon Context
constructor( private carbon:Carbon ) {}

// The App Context (only if you initialized the active context with an app slug!)
constructor( private appContext:App.Context ) {}

// The active context (either carbon or an app context, depending on your initialization).
constructor( @Inject( ContextToken ) private context:Context ) {}

// A basic AuthService that handles cookie based sessions
constructor( @Inject( AuthService.Token ) private authService:AuthService.Class ) {}
```

## Resolvers

### ActiveContextResolver
Resolver that will make sure the Carbon active context is resolved before activating the route.

It needs a route to redirect the user to in case an error occurs configured in the route `data.onError` property.
```typescript
{
    path: "home",
    component: HomeView,
    resolve: {
        activeContext: ActiveContextResolver
    },
    data: {
        onError: [ "/error" ],
    }
},
```

## Guards
All guards need a route to redirect the user to, if the guard rejects the route activation. This route needs to be
defined in the route's `data.onReject` property.

### AuthenticatedGuard
Guard that will prevent the route from being activated when the user hasn't authenticated himself.

```typescript
{
    path: "secured",
    component: SecuredView,
    canActivate: [ AuthenticatedGuard ],
    data: {
        onReject: [ "/login" ],
        onError: [ "/error" ],
    }
}
```

### NotAuthenticatedGuard
Guard that will prevent the route from being activated when the user is already authenticated.
```typescript
{
    path: "login",
    component: LoginView,
    canActivate: [ NotAuthenticatedGuard ],
    data: {
        onReject: [ "/secured" ],
        onError: [ "/error" ],
    }
},
```

## Development Setup
TODO

### Gulp tasks
TODO

### File structure
TODO

## License

	Copyright (c) 2015-present, Base22 Technology Group, LLC.
	All rights reserved.

	This source code is licensed under the BSD-style license found in the
	LICENSE file in the root directory of this source tree.
