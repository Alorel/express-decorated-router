# Express Decorated Router

Define your Express routes in a nice, expressive way using TypeScript decorators!

[![NPM](https://nodei.co/npm/express-decorated-router.png?compact=true)](https://www.npmjs.com/package/express-decorated-router)

[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/express-decorated-router.svg)](https://greenkeeper.io)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/express-decorated-router/badge.svg?branch=1.0.5)](https://coveralls.io/github/Alorel/express-decorated-router?branch=1.0.5)
[![Build Status](https://travis-ci.org/Alorel/express-decorated-router.svg?branch=1.0.5)](https://travis-ci.org/Alorel/express-decorated-router)

-----

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Basic usage](#basic-usage)
- [API](#api)
  - [Decorators](#decorators)
    - [`ALL`(path: `PathParams`)](#allpath-pathparams)
    - [`Controller`(root?: `string`, options?: `RouterOptions`)](#controllerroot-string-options-routeroptions)
    - [`ControllerMiddleware`(first: `RequestHandler`, ...middleware: `RequestHandler[]`)](#controllermiddlewarefirst-requesthandler-middleware-requesthandler)
    - [`DELETE`(path: `PathParams`)](#deletepath-pathparams)
    - [`GET`(path: `PathParams`)](#getpath-pathparams)
    - [`HEAD`(path: `PathParams`)](#headpath-pathparams)
    - [`Method`(httpMethod: `string`, path: `PathParams`)](#methodhttpmethod-string-path-pathparams)
    - [`OPTIONS`(path: `PathParams`)](#optionspath-pathparams)
    - [`PATCH`(path: `PathParams`)](#patchpath-pathparams)
    - [`POST`(path: `PathParams`)](#postpath-pathparams)
    - [`PUT`(path: `PathParams`)](#putpath-pathparams)
    - [`Parent`(parentController: `Function`)](#parentparentcontroller-function)
    - [`RouteMiddleware`(first: `RequestHandler`, ...middleware: `RequestHandler[]`)](#routemiddlewarefirst-requesthandler-middleware-requesthandler)
  - [Classes](#classes)
    - [ExpressDecoratedRouter](#expressdecoratedrouter)
      - [public static `applyRoutes`(app: `IRouter`)](#public-static-applyroutesapp-irouter)
      - [public static `reset`()](#public-static-reset)
    - [ParentControllerError](#parentcontrollererror)
      - [public `child`](#public-child)
      - [public `parent`](#public-parent)
    - [UnregisteredControllerError](#unregisteredcontrollererror)
      - [public `controller`](#public-controller)
- [Example app](#example-app)
- [Common problems](#common-problems)
  - [Routes do not get registered](#routes-do-not-get-registered)
- [Good practices](#good-practices)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Basic usage

```typescript
import * as express from 'express';
import {Controller, ControllerMiddleware, POST, RouteMiddleware, ExpressDecoratedRouter} from 'express-decorated-router';

@Controller('/auth')
@ControllerMiddleware(someMiddleware(), moreMiddleware())
class MyAuthController {

  @POST('/login')
  @RouteMiddleware(onlyApplyToThisRoute())
  public static login(req: express.Request, res: express.Response): void {
    doSomeMagic();
  }
}

const app: express.Application = express();

ExpressDecoratedRouter.applyRoutes(app);
ExpressDecoratedRouter.reset();

```

# API

## Decorators

### `ALL`(path: `PathParams`)

Use this handler for any HTTP method

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **path** | [`PathParams`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :heavy\_check\_mark: | The path this handler will be responsible for |

_Defined in [decorators/method/ALL.ts:8](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/method/ALL.ts#L8)_

* * *

### `Controller`(root?: `string`, options?: `RouterOptions`)

Register this class as a controller

**Returns**: `ClassDecorator`

**Parameters**

|  | Type | Required | Default value | Description |
| --- | --- | --- | --- | --- |
| **root** | `string` | :x: | `"/"` | The root path for this controller |
| **options** | [`RouterOptions`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :x: |  | Options passed to the Express router initialisation function. |

_Defined in [decorators/Controller.ts:9](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/Controller.ts#L9)_

* * *

### `ControllerMiddleware`(first: `RequestHandler`, ...middleware: `RequestHandler[]`)

Define middleware for this controller. Any child controller which defines this class as its @Parent will inherit this middleware.

**Returns**: `ClassDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **first** | [`RequestHandler`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express/index.d.ts) | :heavy\_check\_mark: | A middleware handler |
| **middleware** | [`RequestHandler[]`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express/index.d.ts) | :x: | 0..n additional middleware handlers |

_Defined in [decorators/ControllerMiddleware.ts:10](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/ControllerMiddleware.ts#L10)_

* * *

### `DELETE`(path: `PathParams`)

Use this handler for the DELETE HTTP method

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **path** | [`PathParams`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :heavy\_check\_mark: | The path this handler will be responsible for |

_Defined in [decorators/method/DELETE.ts:8](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/method/DELETE.ts#L8)_

* * *

### `GET`(path: `PathParams`)

Use this handler for the GET HTTP method

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **path** | [`PathParams`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :heavy\_check\_mark: | The path this handler will be responsible for |

_Defined in [decorators/method/GET.ts:8](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/method/GET.ts#L8)_

* * *

### `HEAD`(path: `PathParams`)

Use this handler for the HEAD HTTP method

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **path** | [`PathParams`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :heavy\_check\_mark: | The path this handler will be responsible for |

_Defined in [decorators/method/OPTIONS.ts:8](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/method/OPTIONS.ts#L8)_

* * *

### `Method`(httpMethod: `string`, path: `PathParams`)

Use this handler for the given HTTP method. The method must be one understood by Express' router.METHOD() method

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **httpMethod** | `string` | :heavy\_check\_mark: | The HTTP method |
| **path** | [`PathParams`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :heavy\_check\_mark: | The path this handler will be responsible for |

*   **See**: https://expressjs.com/en/4x/api.html#router.METHOD

_Defined in [decorators/method/Method.ts:10](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/method/Method.ts#L10)_

* * *

### `OPTIONS`(path: `PathParams`)

Use this handler for the OPTIONS HTTP method

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **path** | [`PathParams`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :heavy\_check\_mark: | The path this handler will be responsible for |

_Defined in [decorators/method/HEAD.ts:8](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/method/HEAD.ts#L8)_

* * *

### `PATCH`(path: `PathParams`)

Use this handler for the PATCH HTTP method

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **path** | [`PathParams`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :heavy\_check\_mark: | The path this handler will be responsible for |

_Defined in [decorators/method/PATCH.ts:8](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/method/PATCH.ts#L8)_

* * *

### `POST`(path: `PathParams`)

Use this handler for the POST HTTP method

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **path** | [`PathParams`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :heavy\_check\_mark: | The path this handler will be responsible for |

_Defined in [decorators/method/POST.ts:8](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/method/POST.ts#L8)_

* * *

### `PUT`(path: `PathParams`)

Use this handler for the PUT HTTP method

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **path** | [`PathParams`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts) | :heavy\_check\_mark: | The path this handler will be responsible for |

_Defined in [decorators/method/PUT.ts:8](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/method/PUT.ts#L8)_

* * *

### `Parent`(parentController: `Function`)

Define another controller as this controller's parent, inheriting its root path and middleware.

**Returns**: `ClassDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **parentController** | `Function` | :heavy\_check\_mark: | The parent controller |

_Defined in [decorators/Parent.ts:7](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/Parent.ts#L7)_

* * *

### `RouteMiddleware`(first: `RequestHandler`, ...middleware: `RequestHandler[]`)

Define middleware for this route

**Returns**: `MethodDecorator`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **first** | [`RequestHandler`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express/index.d.ts) | :heavy\_check\_mark: | A middleware handler |
| **middleware** | [`RequestHandler[]`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express/index.d.ts) | :x: | 0..n additional middleware handlers |

_Defined in [decorators/RouteMiddleware.ts:9](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/decorators/RouteMiddleware.ts#L9)_

* * *

## Classes

### ExpressDecoratedRouter

Public interface for the express-decorated-router library

_Defined in [ExpressDecoratedRouter.ts:42](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/ExpressDecoratedRouter.ts#L42)_

#### public static `applyRoutes`(app: `IRouter`)

Apply routes to the Express application. You should call reset() after calling this.

**Returns**: `ExpressDecoratedRouter`

**Parameters**

|  | Type | Required | Description |
| --- | --- | --- | --- |
| **app** | `IRouter` | :heavy\_check\_mark: | The Express application |

*   **Throws**: {ParentControllerError} If the input of a @Parent decoration has not been decorated with @Controller
*   **Throws**: {UnregisteredControllerError} If a class decorated with @Parent was not annotated with @Controller

_Defined in [ExpressDecoratedRouter.ts:139](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/ExpressDecoratedRouter.ts#L139)_

#### public static `reset`()

Reset the library, freeing resources. You should call this method after calling applyRoutes()

**Returns**: `ExpressDecoratedRouter`

_Defined in [ExpressDecoratedRouter.ts:155](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/ExpressDecoratedRouter.ts#L155)_

* * *

### ParentControllerError

Thrown when an input of a @Parent decoration has not been decorated with @Controller

**Extends**: [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

_Defined in [errors/ParentControllerError.ts:4](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/errors/ParentControllerError.ts#L4)_

#### public `child`

The child controller

_Defined in [errors/ParentControllerError.ts:6](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/errors/ParentControllerError.ts#L6)_

#### public `parent`

The parent controller

_Defined in [errors/ParentControllerError.ts:8](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/errors/ParentControllerError.ts#L8)_

* * *

### UnregisteredControllerError

Thrown when a class decorated with @Parent was not annotated with @Controller

**Extends**: [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

_Defined in [errors/UnregisteredControllerError.ts:4](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/errors/UnregisteredControllerError.ts#L4)_

#### public `controller`

The controller

_Defined in [errors/UnregisteredControllerError.ts:6](https://github.com/Alorel/express-decorated-router/blob/1.0.4/src/errors/UnregisteredControllerError.ts#L6)_

* * *

# Example app

An example app can be found in the `example` directory.

# Common problems

## Routes do not get registered

You must `import`/`require` the files containing your routes **before** you call `applyRoutes()`. When in doubt, set
the `DEBUG` environment variable to `express-decorated-router` and see exactly what's going on.

# Good practices

* Always call `ExpressDecoratedRouter.reset()` after applying your routes to free up resources
