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