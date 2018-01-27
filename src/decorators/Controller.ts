import {RouterOptions} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

export function Controller(root = '/', options?: RouterOptions): ClassDecorator {
  return (constructor: Function): void => {
    ExpressDecoratedRouter.addController(constructor, root, options);
  };
}
