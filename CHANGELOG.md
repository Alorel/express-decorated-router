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
