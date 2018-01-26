import {RequestHandler} from 'express';
import {RouteRepository} from '../RouteRepository';
import {Util} from '../Util';

export function RouteMiddleware(...middleware: RequestHandler[]): MethodDecorator {
  return function (target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
    if (middleware.length) {
      if (!descriptor) {
        descriptor = <PropertyDescriptor>Object.getOwnPropertyDescriptor(target, key);
      }
      if (!descriptor) {
        throw new Error('Unable to determine property descriptor');
      }
      if (!descriptor.value) {
        throw new Error('Unable to determine property descriptor value');
      }

      Util.validateMiddleware(descriptor.value);
      for (const mid of middleware) {
        Util.validateMiddleware(mid);
      }

      RouteRepository.addRouteMiddleware(target, descriptor.value, middleware);
    }
  };
}