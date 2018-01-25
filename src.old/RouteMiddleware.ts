import {get, set} from 'lodash';
import {RequestHandler} from "express";

/**
 * Apply middleware to this route
 * @param middleware The middleware to apply
 */
export const RouteMiddleware = (...middleware: RequestHandler[]) => {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (middleware.length) {
      if (!descriptor) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
      }

      const routeMiddlewarePath = '__router.middleware';

      if (!get(target, routeMiddlewarePath)) {
        set(target, routeMiddlewarePath, new Map());
      }

      const midMap: Map<RequestHandler, RequestHandler[]> = get(target, routeMiddlewarePath);

      midMap.set(descriptor.value, middleware);
    }
  }
};