import {RequestHandler} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

export function RouteMiddleware(...middleware: RequestHandler[]): MethodDecorator {
  return (_target: any, _key: string | symbol, descriptor: PropertyDescriptor): void => {
    if (middleware.length) {
      ExpressDecoratedRouter.addRouteMiddleware(descriptor.value, middleware);
    }
  };
}
