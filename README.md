# Express Decorated Router

Defining a large Express controller can be a pain as your IDE (probably)
won't allow you to navigate each route in its project window. Express
Decorated Router solves the problem by allowing controllers to be defined
as static classes with the help of TypeScript's decorators.

# Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->

# API

## @Controller

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

## Example App

A sample potato farm app. Get it [here](https://github.com/Alorel/express-decorated-router/tree/master/example).