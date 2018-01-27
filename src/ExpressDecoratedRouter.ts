import * as debug from 'debug';
import {Application, RequestHandler, Router as createRouter, RouterOptions} from 'express';
import {PathParams} from 'express-serve-static-core';
import forEach = require('lodash/forEach');
import isEmpty = require('lodash/isEmpty');

type HttpMethodSpec = Map<PathParams, RequestHandler>;

interface RouteSpec {
  [httpMethod: string]: HttpMethodSpec;
}

interface ControllerSpec {
  opts?: RouterOptions;
  root: PathParams;
}

// key = controller class
const routeMap = new Map<Function, RouteSpec>();
// key = controller class
const controllerMap = new Map<Function, ControllerSpec>();
// key = controoller class
const controllerMiddlewareMap = new Map<Function, RequestHandler[]>();
// key = method
const routeMiddlewareMap = new Map<RequestHandler, RequestHandler[]>();

const log = debug('express-decorated-router');

export class ExpressDecoratedRouter {

  /** @internal */
  public static addController(clazz: Function, root: PathParams, opts?: RouterOptions): void {
    controllerMap.set(clazz, {root, opts});
    log(
      'Decorating class %s as a controller with root %s and options %o',
      clazz.name,
      root,
      opts
    );
  }

  /** @internal */
  public static addControllerMiddleware(clazz: any, middleware: RequestHandler[]): void {
    controllerMiddlewareMap.set(clazz, middleware);
    log('Adding %d middleware functions to controller %s', middleware.length, clazz.name);
  }

  /** @internal */
  public static addRoute(clazz: Function, httpMethod: string, path: PathParams, handler: RequestHandler): void {
    log('Adding %s %s route to controller %s', httpMethod.toUpperCase(), path, clazz.name);
    let routeSpec: RouteSpec = <RouteSpec>routeMap.get(clazz);

    /* istanbul ignore else */
    if (!routeSpec) {
      log('Route spec object does not exist - creating');
      routeSpec = {};
      routeMap.set(clazz, routeSpec);
    } else {
      log('Route spec object already exists');
    }

    let httpMethodSpec: HttpMethodSpec = routeSpec[httpMethod];
    /* istanbul ignore else */
    if (!httpMethodSpec) {
      log('Http spec map does not exist - creating');
      httpMethodSpec = new Map<PathParams, RequestHandler>();
      routeSpec[httpMethod] = httpMethodSpec;
    } else {
      log('Http spec map already exists');
    }

    httpMethodSpec.set(path, handler);
  }

  /** @internal */
  public static addRouteMiddleware(route: RequestHandler, middleware: RequestHandler[]): void {
    routeMiddlewareMap.set(route, middleware);
    log('Adding %s middleware functions to handler %s', middleware.length, route.name);
  }

  public static applyRoutes(app: Application): void {
    log('Applying routes to Express app');

    for (const controllerMapEntry of controllerMap.entries()) {
      const clazz: Function = controllerMapEntry[0];
      const controllerSpec: ControllerSpec = controllerMapEntry[1];
      log('Resolved controller as %s, controller spec as %o', clazz.name, controllerSpec);

      if (!routeMap.has(clazz)) {
        log('Controller %s has no routes - skipping', clazz.name);
        continue;
      }
      const routeSpec: RouteSpec = <RouteSpec>routeMap.get(clazz);
      if (isEmpty(routeSpec)) {
        log('Controller %s has an empty route spec - skipping', clazz.name);
        continue;
      }

      const router = createRouter(controllerSpec.opts);

      if (controllerMiddlewareMap.has(clazz)) {
        const controllerMiddleware: RequestHandler[] = <RequestHandler[]>controllerMiddlewareMap.get(clazz);
        log('Controller %s has %d middleware functions assigned', clazz.name, controllerMiddleware.length);
        router.use(controllerMiddleware);
      } else {
        log('Controller %s has no middleware functions assigned', clazz.name);
      }

      log('Parsing route specs for controller %s', clazz.name);
      forEach(routeSpec, (httpMethodSpec: HttpMethodSpec, httpMethod: string): void => {
        log('Parsing %s routes for controller %s', httpMethod.toUpperCase(), clazz.name);

        for (const httpMethodSpecEntry of httpMethodSpec.entries()) {
          const pathParams: PathParams = httpMethodSpecEntry[0];
          let requestHandler: RequestHandler | RequestHandler[] = httpMethodSpecEntry[1];

          log('Method %s resolved to path %s', requestHandler.name, pathParams);

          const routeMiddleware: RequestHandler[] = <RequestHandler[]>routeMiddlewareMap.get(requestHandler);
          if (routeMiddleware && routeMiddleware.length) {
            log('And has %d middleware functions', routeMiddleware.length);

            router.use(pathParams, routeMiddleware);
          } else {
            log('And has no middleware functions');
          }

          router[httpMethod](pathParams, requestHandler);
        }
      });

      log(
        'Adding controller %s with root %s and options %o to app',
        clazz.name,
        controllerSpec.root,
        controllerSpec.opts
      );
      app.use(controllerSpec.root, router);
    }
  }

  public static reset(): void {
    log('Resetting route map');
    routeMap.clear();

    log('Resetting controller map');
    controllerMap.clear();

    log('Resetting controller middleware map');
    controllerMiddlewareMap.clear();

    log('Resetting route middleware map');
    routeMiddlewareMap.clear();
  }
}
