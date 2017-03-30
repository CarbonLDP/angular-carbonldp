## 0.8.0 (2017/03/30)

- Remove `reflect-metadata` as dependency as it is not used anymore

## 0.7.0 (2017/03/30)

#### Breaking changes

- Rename package to `angular-carbonldp`. All imports need to be renamed as well.

## 0.6.0 (2017/03/30)

- Complete #14 - Change peer dependencies so they allow any `@angular` 2.x version

## 0.5.0 (2017/03/27)

- Make the library AoT compliant
- Update `carbonldp` package to `^0.42.0` (latest AoT compatible version)
- Update `@angular` packages to latest 2+ stable release (`2.4.9`)

## 0.4.2 (2017/02/23)

- Update `carbonldp` package to `^0.40.0` (latest semi-stable version)
- Fix build task

## 0.4.1 (2016/10/11)

- Update `@angular` packages to stable release (2.0.2)

## 0.3.3 (2016/09/28)

- Fix #6
    - Make the injection of dependencies asynchronous
- Add `watch` gulp task
- Update `README` with latest initialization example

## 0.3.2 (2016/09/02)

- Add signature to Auth.Service register function to allow a slug parameter to define the agent id.
- Implement new Auth.Service register signature to send the optional slug when creating the agent.
- Fix `@angular` packages versions

## 0.3.1 (2016/08/24)

- Update `carbonldp` to `0.37.0`

## 0.3.0 (2016/08/15)

- Update `angular2` to RC5

#### Breaking changes

- Decorators no longer exist. Instead the following classes will take their place:
    - `Authenticated` is now `AuthenticatedGuard`
    - `NotAuthenticated` is now `NotAuthenticatedGuard`
    - `RequiresActiveContext` is now `ActiveContextResolver`
- Instead of decorating your view, now you need to setup `guards` or `resolvers` in your routing table.
    For `resolvers` you need to define the route the user should be redirected when an error occurs on the `data.onError` property. `guards` also need a route to redirect the user to when the guard failed on the `data.onReject` property.
    Example:
    ```
    const appRoutes:Routes = [
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
        {
            path: "secured",
            component: SecuredView,
            canActivate: [ AuthenticatedGuard ],
            data: {
                onReject: [ "/login" ],
                onError: [ "/error" ],
            }
        }
    ];
    ```

## 0.2.2 (2016/08/09)

- Add `SecurityAnnotation` to abstract behaviour

## 0.2.1 (2016/08/08)

- Fix error with `RequiresActiveContext` due to an uncaught rejected promise

## 0.2.0 (2016/08/05)

- Update carbonldp to 0.36.0

## 0.1.12 (2016/07/15)

- Fix supported `@angular` versions in `package.json`

## 0.1.11 (2016/06/23)

- Fix minor compilation error
- Update @angular to RC.3

## 0.1.10 (2016/05/27)

- Restructured project so that only `dist` is published to npm

#### Breaking changes

- Definition file `dist/index.d.ts` doesn't exist anymore. To use the package configure `"moduleResolution": "node"` in `tsconfig.json`

## 0.1.8 (2016/04/12)

- Changed the authentication to handle invalid tokens instead of throwing an error

## 0.1.4 (2016/04/01)

- Added `authChanged$` to `AuthService`

## 0.1.3 (2016/04/01)

- Added `loggedInEmitter` and `loggedOutEmitter` to `AuthService`

## 0.1.2 (2016/04/01)

- Added JSPM dist directory

## 0.1.1 (2016/03/31)

- Fixed node and JSPM file resolution
- Updated carbonldp dependency

## 0.1.0 (2016/03/31)

- Initial release
