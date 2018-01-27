import {RequestHandler} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

export function ControllerMiddleware(first: RequestHandler, ...middleware: RequestHandler[]): ClassDecorator {
  return (constructor: Function): void => {
    ExpressDecoratedRouter.addControllerMiddleware(constructor, [first].concat(middleware));
  };
}
