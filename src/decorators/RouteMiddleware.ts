import {RequestHandler} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

export function RouteMiddleware(...middleware: RequestHandler[]): MethodDecorator {
  return (_target: any, _key: string | symbol, descriptor: PropertyDescriptor): void => {
    if (middleware.length) {
      if (!descriptor) {
        throw new Error('Unable to determine property descriptor');
      }
      if (!descriptor.value) {
        throw new Error('Unable to determine property descriptor value');
      }

      ExpressDecoratedRouter.addRouteMiddleware(descriptor.value, middleware);
    }
  };
}
