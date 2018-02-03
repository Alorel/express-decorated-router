# 1.0.0 (2018-02-03)

The library has been rewritten from the ground up.

* `[breaking]` All types are now properly imported from the package root
* `[breaking]` The old way of applying routes to the Express app has been removed. See the basic usage section in the README.
* `[breaking]` `[removed]` The library no longer has a method for loading controllers from a given glob path - you must do this yourself. 
* `[refactor]` The library no longer sets private metadata on your controller classes and, instead, uses its own internal data structures.
* `[feat]` Route path expressions now accept regular expressions, string arrays and regex arrays.
* `[feat]` It's now possible to assign a parent controller.
