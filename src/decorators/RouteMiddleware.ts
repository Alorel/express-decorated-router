import {RequestHandler} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

/**
 * Define middleware for this route
 * @param first A middleware handler
 * @param middleware 0..n additional middleware handlers
 */
export function RouteMiddleware(first: RequestHandler, ...middleware: RequestHandler[]): MethodDecorator {
  return (_target: any, _key: string | symbol, descriptor: PropertyDescriptor): void => {
    ExpressDecoratedRouter.addRouteMiddleware(descriptor.value, [first].concat(middleware));
  };
}
