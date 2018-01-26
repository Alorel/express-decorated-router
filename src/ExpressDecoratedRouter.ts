import {Application, RequestHandler, Router as createRouter, RouterOptions} from 'express';
import forEach = require('lodash/forEach');
import isEmpty = require('lodash/isEmpty');
import set = require('lodash/set');

interface HttpMethodSpec {
  [path: string]: RequestHandler;
}

interface RouteSpec {
  [httpMethod: string]: HttpMethodSpec;
}

interface ControllerSpec {
  opts?: RouterOptions;
  root: string;
}

const routeMap = new Map<any, RouteSpec>();
const controllerMap = new Map<any, ControllerSpec>();
const controllerMiddlewareMap = new Map<any, RequestHandler[]>();
const routeMiddlewareMap = new Map<RequestHandler, RequestHandler[]>();

export class ExpressDecoratedRouter {

  /** @internal */
  public static addController(clazz: any, root: string, opts?: RouterOptions): void {
    controllerMap.set(clazz, {root, opts});
  }

  /** @internal */
  public static addControllerMiddleware(clazz: any, middleware: RequestHandler[]): void {
    controllerMiddlewareMap.set(clazz, middleware);
  }

  /** @internal */
  public static addRoute(clazz: any, httpMethod: string, path: string, handler: RequestHandler): void {
    let routeSpec: RouteSpec = <RouteSpec>routeMap.get(clazz);

    if (!routeSpec) {
      routeSpec = {};
      routeMap.set(clazz, routeSpec);
    }

    set(routeSpec, [httpMethod, path], handler);
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

      const router = createRouter(controllerSpec.opts);

      if (controllerMiddlewareMap.has(clazz)) {
        router.use(<RequestHandler[]>controllerMiddlewareMap.get(clazz));
      }

      const routeSpec: RouteSpec = <RouteSpec>routeMap.get(clazz);

      if (isEmpty(routeSpec)) {
        continue;
      }

      forEach(routeSpec, (httpMethodSpec: HttpMethodSpec, httpMethod: string): void => {
        if (!isEmpty(httpMethodSpec)) {
          forEach(httpMethodSpec, (handler: RequestHandler, path: string): void => {
            if (routeMiddlewareMap.has(handler)) {
              router.use(path, <RequestHandler[]>routeMiddlewareMap.get(handler));
            }
            router[httpMethod](path, handler);
          });
        }
      });

      app.use(controllerSpec.root, router);
    }
  }
}
