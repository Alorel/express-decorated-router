import {cloneDeep, forEach, get, isArray, keys, set} from 'lodash';
import {RequestHandler} from "express";
import {IController} from "../interfaces/IController";
import {IControllerDefinition} from "../interfaces/IControllerDefinition";

/**
 * Parse the controller into a loadable form
 * @param router A class with routes defined
 * @param {boolean} clean If set to true (default), cleans up the class created by the routing decorators and making it impossible to parse the class again.
 * @returns {IController} A controller definition that's usable by the loader
 */
export const parseController = (router: any, clean: boolean = true): IController => {
  const out: Partial<IController> = {};
  out.root = get(router, '__router.root');

  if (!out.root) {
    throw new Error('The controller must be annotated with @Controller!');
  }

  out.defs = cloneDeep(get(router, '__router.defs', {}));

  const controllerMiddleware: RequestHandler[] = get(router, '__router.use', []);

  const routeMiddleware: Map<RequestHandler, RequestHandler[]> = get(router, '__router.middleware');

  if (routeMiddleware) {
    for (const x of routeMiddleware.entries()) {
      const method: RequestHandler = x[0];
      const mids: RequestHandler[] = x[1];

      const resolved = <ResolveMiddlewareResult>resolveRouteMiddleware(method, out.defs);

      if (resolved) {
        out.defs[resolved.httpMethod][resolved.path] = mids.concat(method);
      }
    }
  }

  if (controllerMiddleware.length) {
    forEach(out.defs, (routes: IControllerDefinition, httpMethod: string) => {
      forEach(routes, (handler: any, path: string) => {
        if (!isArray(handler)) {
          handler = [handler];
        }

        set(out, ['defs', httpMethod, path], controllerMiddleware.slice().concat(...handler));
      });
    });
  }

  if (clean) {
    router['__router'] = undefined;
  }

  return <IController>out;
};

const resolveRouteMiddleware = (method: Function, defs: IControllerDefinition): ResolveMiddlewareResult | void => {
  for (const httpMethod of keys(defs)) {
    for (const path of keys(defs[httpMethod])) {
      if (defs[httpMethod][path] === method) {
        return {httpMethod, path} as ResolveMiddlewareResult;
      }
    }
  }
};

interface ResolveMiddlewareResult {
  httpMethod: string,
  path: string
}