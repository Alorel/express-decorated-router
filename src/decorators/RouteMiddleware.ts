import {RequestHandler} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

export function RouteMiddleware(first: RequestHandler, ...middleware: RequestHandler[]): MethodDecorator {
  return (_target: any, _key: string | symbol, descriptor: PropertyDescriptor): void => {
    ExpressDecoratedRouter.addRouteMiddleware(descriptor.value, [first].concat(middleware));
  };
}
