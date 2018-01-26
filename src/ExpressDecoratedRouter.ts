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

const routeMap = new Map<any, RouteSpec>();
const controllerMap = new Map<any, ControllerSpec>();
const controllerMiddlewareMap = new Map<any, RequestHandler[]>();
const routeMiddlewareMap = new Map<RequestHandler, RequestHandler[]>();

export class ExpressDecoratedRouter {

  /** @internal */
  public static addController(clazz: Function, root: PathParams, opts?: RouterOptions): void {
    controllerMap.set(clazz, {root, opts});
  }

  /** @internal */
  public static addControllerMiddleware(clazz: any, middleware: RequestHandler[]): void {
    controllerMiddlewareMap.set(clazz, middleware);
  }

  /** @internal */
  public static addRoute(clazz: any, httpMethod: string, path: PathParams, handler: RequestHandler): void {
    let routeSpec: RouteSpec = <RouteSpec>routeMap.get(clazz);

    if (!routeSpec) {
      routeSpec = {};
      routeMap.set(clazz, routeSpec);
    }

    let httpMethodSpec: HttpMethodSpec = routeSpec[httpMethod];
    if (!httpMethodSpec) {
      httpMethodSpec = new Map<PathParams, RequestHandler>();
    }

    httpMethodSpec.set(path, handler);
  }

  /** @internal */
  public static addRouteMiddleware(route: RequestHandler, middleware: RequestHandler[]): void {
    routeMiddlewareMap.set(route, middleware);
  }

  public static applyRoutes(app: Application): void {
    for (const controllerMapEntry of controllerMap.entries()) {
      const clazz: any = controllerMapEntry[0];
      const controllerSpec: ControllerSpec = controllerMapEntry[1];

      if (!routeMap.has(clazz)) {
        continue;
      }
      const routeSpec: RouteSpec = <RouteSpec>routeMap.get(clazz);
      if (isEmpty(routeSpec)) {
        continue;
      }

      const router = createRouter(controllerSpec.opts);

      if (controllerMiddlewareMap.has(clazz)) {
        router.use(<RequestHandler[]>controllerMiddlewareMap.get(clazz));
      }

      forEach(routeSpec, (httpMethodSpec: HttpMethodSpec, httpMethod: string): void => {
        for (const httpMethodSpecEntry of httpMethodSpec.entries()) {
          const pathParams: PathParams = httpMethodSpecEntry[0];
          const requestHandler: RequestHandler = httpMethodSpecEntry[1];

          if (routeMiddlewareMap.has(requestHandler)) {
            router.use(pathParams, <RequestHandler[]>routeMiddlewareMap.get(requestHandler));
          }

          router[httpMethod](pathParams, requestHandler);
        }
      });

      app.use(controllerSpec.root, router);
    }
  }
}
