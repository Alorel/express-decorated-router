import {PathParams} from 'express-serve-static-core';
import {ExpressDecoratedRouter} from '../../ExpressDecoratedRouter';

/**
 * Use this handler for the given HTTP method. The method must be one understood by Express' router.METHOD() method
 * @see https://expressjs.com/en/4x/api.html#router.METHOD
 * @param httpMethod The HTTP method
 * @param path The path this handler will be responsible for
 */
export function Method(httpMethod: string, path: PathParams): MethodDecorator {
  return (target: any, _key: string | symbol, descriptor: PropertyDescriptor): void => {
    ExpressDecoratedRouter.addRoute(target, httpMethod, path, descriptor.value);
  };
}
