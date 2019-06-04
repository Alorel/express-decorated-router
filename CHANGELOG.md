## [1.0.5](https://github.com/Alorel/express-decorated-router/compare/1.0.4...1.0.5) (2019-06-04)


### Dependency updates

* **package:** update [@types](https://github.com/types)/node to version 12.0.0 ([aedd2b7](https://github.com/Alorel/express-decorated-router/commit/aedd2b7))


### Maintenance

* Ignore typedoc updates ([6aeacdf](https://github.com/Alorel/express-decorated-router/commit/6aeacdf))
* Update other dependencies ([4d378ee](https://github.com/Alorel/express-decorated-router/commit/4d378ee))


### Refactoring

* Fix lint errors ([5f863f5](https://github.com/Alorel/express-decorated-router/commit/5f863f5))

## [1.0.4](https://github.com/Alorel/express-decorated-router/compare/1.0.3...1.0.4) (2018-09-25)


### Bug Fixes

* index.ts now correctly exports the PUT method ([59d2d25](https://github.com/Alorel/express-decorated-router/commit/59d2d25)), closes [#20](https://github.com/Alorel/express-decorated-router/issues/20)

## [1.0.3](https://github.com/Alorel/express-decorated-router/compare/v1.0.2...1.0.3) (2018-09-11)


### Dependency updates

* Update ts-node to the latest version 🚀 (#13) ([faa6317](https://github.com/Alorel/express-decorated-router/commit/faa6317)), closes [#13](https://github.com/Alorel/express-decorated-router/issues/13)
* Update nyc to the latest version 🚀 (#12) ([a5722fc](https://github.com/Alorel/express-decorated-router/commit/a5722fc)), closes [#12](https://github.com/Alorel/express-decorated-router/issues/12)
* Update env-cmd to the latest version 🚀 (#11) ([cacf169](https://github.com/Alorel/express-decorated-router/commit/cacf169)), closes [#11](https://github.com/Alorel/express-decorated-router/issues/11)
* Update ts-node to the latest version 🚀 (#9) ([a000370](https://github.com/Alorel/express-decorated-router/commit/a000370)), closes [#9](https://github.com/Alorel/express-decorated-router/issues/9)
* **package:** update debug to version 4.0.0 ([0bb1c53](https://github.com/Alorel/express-decorated-router/commit/0bb1c53))


### Maintenance

* Refresh package-lock.json ([7a0e432](https://github.com/Alorel/express-decorated-router/commit/7a0e432))
* rm no-unused-variable from tslint ([338ea10](https://github.com/Alorel/express-decorated-router/commit/338ea10))
* Run tslint --fix for updated rules ([8274116](https://github.com/Alorel/express-decorated-router/commit/8274116))


### Tests

* Cast @RouteMiddleware params to <any> ([e4a5ae5](https://github.com/Alorel/express-decorated-router/commit/e4a5ae5))
* rm RequestHandler types from Middleware.ts ([3e4dfb4](https://github.com/Alorel/express-decorated-router/commit/3e4dfb4))

# 1.0.2 (2018-03-03)

* `[tweak]` Made the TypeScript definitions more lenient - `applyRoutes()` now accepts any router, not just the application. Vanilla JavaScript users will see no change whatsoever.

# 1.0.1 (2018-02-03)

* `[fix]` fixed the example code
* `[feat]` ExpressDecoratedRouter's static methods are now chainable
* `[doc]` API docs now have return types in them

# 1.0.0 (2018-02-03)

The library has been rewritten from the ground up.

* `[breaking]` All types are now properly imported from the package root
* `[breaking]` The old way of applying routes to the Express app has been removed. See the basic usage section in the README.
* `[breaking]` `[removed]` The library no longer has a method for loading controllers from a given glob path - you must do this yourself. 
* `[refactor]` The library no longer sets private metadata on your controller classes and, instead, uses its own internal data structures.
* `[feat]` Route path expressions now accept regular expressions, string arrays and regex arrays.
* `[feat]` It's now possible to assign a parent controller.
