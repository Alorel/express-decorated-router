import set = require('lodash/set');

interface HttpMethodSpec {
  [path: string]: any;
}

interface RouteSpec {
  [httpMethod: string]: HttpMethodSpec;
}

const routeMap = new WeakMap<any, RouteSpec>();

/** @internal */
export class RouteRepository {

  public static addRoute(clazz: any, httpMethod: string, path: string, handler: any): void {
    let routeSpec: RouteSpec = <RouteSpec>routeMap.get(clazz);

    if (!routeSpec) {
      routeSpec = {};
      routeMap.set(clazz, routeSpec);
    }

    set(routeSpec, [httpMethod, path], handler);
  }
}
