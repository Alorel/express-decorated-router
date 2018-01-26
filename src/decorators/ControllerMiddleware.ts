import {RequestHandler} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

export function ControllerMiddleware(...middleware: RequestHandler[]): ClassDecorator {
  return (constructor: Function): void => {
    if (middleware.length) {
      ExpressDecoratedRouter.addControllerMiddleware(constructor, middleware);
    }
  };
}
