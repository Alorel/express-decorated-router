import {RequestHandler} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';
import {Util} from '../Util';

export function ControllerMiddleware(...middleware: RequestHandler[]): ClassDecorator {
  for (const mid of middleware) {
    Util.validateMiddleware(mid);
  }

  return function(constructor: any): void {
    if (middleware.length) {
      ExpressDecoratedRouter.addControllerMiddleware(constructor, middleware);
    }
  };
}
