import {RouterOptions} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

/**
 * Register this class as a controller
 * @param root The root path for this controller
 * @param options Options passed to the Express router initialisation function.
 */
export function Controller(root = '/', options?: RouterOptions): ClassDecorator {
  return (constructor: Function): void => {
    ExpressDecoratedRouter.addController(constructor, root, options);
  };
}
