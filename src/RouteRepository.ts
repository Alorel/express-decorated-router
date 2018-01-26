import set = require('lodash/set');
import {RequestHandler} from 'express';

interface HttpMethodSpec {
  [path: string]: RequestHandler;
}

interface RouteSpec {
  [httpMethod: string]: HttpMethodSpec;
}

type ControllerRoutes = WeakMap<RequestHandler, RequestHandler[]>;

const routeMap = new WeakMap<any, RouteSpec>();
const controllerMap = new WeakMap<any, string>();
const controllerMiddlewareMap = new WeakMap<any, RequestHandler[]>();
const routeMiddlewareMap = new WeakMap<any, ControllerRoutes>();

/** @internal */
export class RouteRepository {

  public static addController(clazz: any, root: string): void {
    controllerMap.set(clazz, root);
  }

  public static addControllerMiddleware(clazz: any, middleware: RequestHandler[]): void {
    controllerMiddlewareMap.set(clazz, middleware);
  }

  public static addRoute(clazz: any, httpMethod: string, path: string, handler: RequestHandler): void {
    let routeSpec: RouteSpec = <RouteSpec>routeMap.get(clazz);

    if (!routeSpec) {
      routeSpec = {};
      routeMap.set(clazz, routeSpec);
    }

    set(routeSpec, [httpMethod, path], handler);
  }

  public static addRouteMiddleware(clazz: any, route: RequestHandler, middleware: RequestHandler[]): void {
    let controllerRoutes: ControllerRoutes = <ControllerRoutes>routeMiddlewareMap.get(clazz);

    if (!controllerRoutes) {
      controllerRoutes = new WeakMap<RequestHandler, RequestHandler[]>();
      routeMiddlewareMap.set(clazz, controllerRoutes);
    }

    controllerRoutes.set(route, middleware);
  }
}
