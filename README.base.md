# Express Decorated Router

Define your Express routes in a nice, expressive way using TypeScript decorators!

[![NPM](https://nodei.co/npm/express-decorated-router.png?compact=true)](https://www.npmjs.com/package/express-decorated-router)

[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/express-decorated-router.svg)](https://greenkeeper.io)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/express-decorated-router/badge.svg?branch=master)](https://coveralls.io/github/Alorel/express-decorated-router?branch=master)
[![Build Status](https://travis-ci.org/Alorel/express-decorated-router.svg?branch=master)](https://travis-ci.org/Alorel/express-decorated-router)

-----

# Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->

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

<!-- INSERT API HERE -->

# Example app

An example app can be found in the `example` directory.

# Common problems

## Routes do not get registered

You must `import`/`require` the files containing your routes **before** you call `applyRoutes()`. When in doubt, set
the `DEBUG` environment variable to `express-decorated-router` and see exactly what's going on.

# Good practices

* Always call `ExpressDecoratedRouter.reset()` after applying your routes to free up resources
