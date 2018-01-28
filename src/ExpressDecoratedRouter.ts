import * as debug from 'debug';
import {Application, RequestHandler, Router as createRouter, RouterOptions} from 'express';
import {PathParams, Router} from 'express-serve-static-core';
import forEach = require('lodash/forEach');
import isEmpty = require('lodash/isEmpty');
import {ParentControllerError} from './errors/ParentControllerError';
import {UnregisteredControllerError} from './errors/UnregisteredControllerError';

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
// key = controller class
const routerMap = new Map<Function, Router>();
// key = child, value = parent
const parentMap = new Map<Function, Function>();

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
  public static addControllerMiddleware(clazz: Function, middleware: RequestHandler[]): void {
    controllerMiddlewareMap.set(clazz, middleware);
    log('Adding %d middleware functions to controller %s', middleware.length, clazz.name);
  }

  /** @internal */
  public static addParent(child: Function, parent: Function): void {
    log('Setting %s as the parent controller of %s', parent.name, child.name);
    parentMap.set(child, parent);
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
      ExpressDecoratedRouter.processController(app, controllerMapEntry[0], controllerMapEntry[1]);
    }
    for (const parentMapEntry of parentMap.entries()) {
      ExpressDecoratedRouter.processParents(parentMapEntry[0], parentMapEntry[1]);
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

    log('Resetting router map');
    routerMap.clear();

    log('Resetting parent map');
    parentMap.clear();
  }

  private static processController(app: Application, controller: Function, controllerSpec: ControllerSpec): void {
    log('Resolved controller as %s, controller spec as %o', controller.name, controllerSpec);

    if (!routeMap.has(controller)) {
      log('Controller %s has no routes - skipping', controller.name);

      return;
    }
    const routeSpec: RouteSpec = <RouteSpec>routeMap.get(controller);
    if (isEmpty(routeSpec)) {
      log('Controller %s has an empty route spec - skipping', controller.name);

      return;
    }

    const router: Router = createRouter(controllerSpec.opts);

    ExpressDecoratedRouter.processControllerMiddleware(router, controller);

    log('Parsing route specs for controller %s', controller.name);
    forEach(routeSpec, (httpMethodSpec: HttpMethodSpec, httpMethod: string): void => {
      ExpressDecoratedRouter.processRouteSpec(router, controller, httpMethod, httpMethodSpec);
    });

    log(
      'Adding controller %s with root %s and options %o to app',
      controller.name,
      controllerSpec.root,
      controllerSpec.opts
    );
    routerMap.set(controller, router);

    if (!parentMap.has(controller)) {
      app.use(controllerSpec.root, router);
    }
  }

  private static processControllerMiddleware(router: Router, controller: Function): void {
    if (controllerMiddlewareMap.has(controller)) {
      const controllerMiddleware: RequestHandler[] = <RequestHandler[]>controllerMiddlewareMap.get(controller);
      log('Controller %s has %d middleware functions assigned', controller.name, controllerMiddleware.length);
      router.use(controllerMiddleware);
    } else {
      log('Controller %s has no middleware functions assigned', controller.name);
    }
  }

  private static processHttpMethodSpec(router: Router,
                                       pathParams: PathParams,
                                       requestHandler: RequestHandler,
                                       httpMethod: string): void {
    log('Method %s resolved to path %s', requestHandler.name, pathParams);
    ExpressDecoratedRouter.processRouteMiddleware(router, pathParams, routeMiddlewareMap.get(requestHandler));
    router[httpMethod](pathParams, requestHandler);
  }

  private static processParents(child: Function, parent: Function): void {
    log('Processing parent %s of child %s', parent.name, child.name);

    const parentRouter: Router | undefined = routerMap.get(parent);
    if (parentRouter) {
      log('Parent router found');
      const childRouter: Router | undefined = routerMap.get(child);

      if (childRouter) {
        log('Child router found');
        const childSpec: ControllerSpec = <ControllerSpec>controllerMap.get(child);
        const parentMiddleware: RequestHandler[] | undefined = controllerMiddlewareMap.get(parent);

        if (parentMiddleware && parentMiddleware.length) {
          log(
            'Parent router %s has %d middleware applied. Transferring to %s',
            parent.name,
            parentMiddleware.length,
            child.name
          );

          childRouter.use(parentMiddleware);
        }

        parentRouter.use(childSpec.root, childRouter);
      } else {
        throw new UnregisteredControllerError(child);
      }
    } else {
      throw new ParentControllerError(child, parent);
    }
  }

  private static processRouteMiddleware(router: Router,
                                        pathParams: PathParams,
                                        routeMiddleware?: RequestHandler[]): void {
    if (routeMiddleware && routeMiddleware.length) {
      log('And has %d middleware functions', routeMiddleware.length);

      router.use(pathParams, routeMiddleware);
    } else {
      log('And has no middleware functions');
    }
  }

  private static processRouteSpec(router: Router,
                                  controller: Function,
                                  httpMethod: string,
                                  httpMethodSpec: HttpMethodSpec): void {

    log('Parsing %s routes for controller %s', httpMethod.toUpperCase(), controller.name);

    for (const httpMethodSpecEntry of httpMethodSpec.entries()) {
      const pathParams: PathParams = httpMethodSpecEntry[0];
      const requestHandler: RequestHandler = httpMethodSpecEntry[1];

      ExpressDecoratedRouter.processHttpMethodSpec(router, pathParams, requestHandler, httpMethod);
    }
  }
}
