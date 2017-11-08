# Express Decorated Router

[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/express-decorated-router.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/express-decorated-router.png?compact=true)](https://www.npmjs.com/package/express-decorated-router)

Defining a large Express controller can be a pain as your IDE (probably)
won't allow you to navigate each route in its project window. Express
Decorated Router solves the problem by allowing controllers to be defined
as static classes with the help of TypeScript's decorators.

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [API](#api)
  - [`@Controller(path: string)`](#controllerpath-string)
  - [`@ControllerMiddleware(...middleware: RequestHandler[])`](#controllermiddlewaremiddleware-requesthandler)
  - [Route decorators](#route-decorators)
  - [`@Method(httpMethod: string, path: string)`](#methodhttpmethod-string-path-string)
  - [`@RouteMiddleware(...middleware: RequestHandler[])`](#routemiddlewaremiddleware-requesthandler)
  - [ControllerLoader](#controllerloader)
- [Examples](#examples)
  - [Basic Controller](#basic-controller)
  - [Loading routes from a single controller](#loading-routes-from-a-single-controller)
  - [Loading routes from a directory of controllers](#loading-routes-from-a-directory-of-controllers)
  - [Example App](#example-app)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# API

## `@Controller(path: string)`

Decorate the class as a controller and specify its root path

## `@ControllerMiddleware(...middleware: RequestHandler[])`

Specify a list of middleware functions that will run before every route
in this controller. These functions will run in the order in which they
were defined, before any route-specific middleware functions.

## Route decorators

The following route decorators are supported:

* `@ALL(path: string)`
* `@DELETE(path: string)`
* `@GET(path: string)`
* `@HEAD(path: string)`
* `@OPTIONS(path: string)`
* `@PATCH(path: string)`
* `@POST(path: string)`
* `@PUT(path: string)`

Each makes the class static method accept requests on that HTTP method.
The annotations **must only be used on static methods**.

## `@Method(httpMethod: string, path: string)`

A lower level route decorator which allows you to specify the HTTP
method manually. This is mapped directly to Express' router methods,
e.g. `@Method('get', '/')` maps to `router.get()`.

## `@RouteMiddleware(...middleware: RequestHandler[])`

Same as [`@ControllerMiddleware`](#controllermiddlewaremiddleware-requesthandler),
but makes the middleware apply only to this route.

## ControllerLoader

A class responsible for parsing and loading controllers into your app.
When multiple controller files are loaded, **each file must export only
the controller class**, i.e.

```typescript
@Controller('/foo')
class FooController {
  // ... routes
}

export = FooController;
```

See [Loading routes from a single controller](#loading-routes-from-a-single-controller)
and [Loading routes from a directory of controllers](#loading-routes-from-a-directory-of-controllers).


# Examples

## Basic Controller

```typescript
import {Controller, ControllerMiddleware, GET, POST, RouteMiddleware} from "express-decorated-router/dist";
import {NextFunction, Request, RequestHandler, Response} from "express";
import * as bodyParser from "body-parser";

@Controller('/user') // Set /user as the root URL
@ControllerMiddleware(checkAuthHeader) // Run some middleware before every route
class UserAPI {

  @GET('/') // GET /user/
  static async find(req: Request, res: Response): Promise<void> {
    try {
      const users: User[] = await MyDatabase.find();
      res.json(users);
    } catch (e) {
      res.status(500).end();
    }
  }

  @GET('/:id') // GET /user/:id
  static async findOne(req: Request, res: Response): Promise<void> {
    try {
      const user: User | null = await MyDatabase.findOne(req.params.id);

      if (user) {
        res.json(user);
      } else {
        res.status(403).end();
      }
    } catch (e) {
      res.status(500).end();
    }
  }

  @POST('/') // POST /user/
  @RouteMiddleware(bodyParser.json()) // load body parser middleware for this route only
  static async create(req: Request, res: Response): Promise<void> {
    try {
      if (!verifyRequestBody(req.body)) {
        res.status(400).end();
      } else if (await MyDatabase.findOne(req.body.id)) {
        res.status(409).end();
      } else {
        const user: User = await MyDatabase.create(req.body);
        res.status(201).end();
      }
    } catch (e) {
      res.status(500).end();
    }
  }
}

export = UserAPI;
```

## Loading routes from a single controller

```typescript
const app: Application = express();
const controllerLoader: ControllerLoader = new ControllerLoader(app);
controllerLoader.loadController(FooController);
```

## Loading routes from a directory of controllers

```typescript
const app: Application = express();
const controllerLoader: ControllerLoader = new ControllerLoader(app);
controllerLoader.loadDirectories('./path/to/controllers/**/*.js');
```

## Example App

A sample potato farm app. Get it [here](https://github.com/Alorel/express-decorated-router/tree/master/example).