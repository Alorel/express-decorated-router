import {RequestHandler} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

/**
 * Define middleware for this controller. Any child controller which defines this class as its @Parent will inherit
 * this middleware.
 * @param first A middleware handler
 * @param middleware 0..n additional middleware handlers
 */
export function ControllerMiddleware(first: RequestHandler, ...middleware: RequestHandler[]): ClassDecorator {
  return (constructor: Function): void => {
    ExpressDecoratedRouter.addControllerMiddleware(constructor, [first].concat(middleware));
  };
}
