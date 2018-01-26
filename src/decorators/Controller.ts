import {RouterOptions} from 'express';
import {PathParams} from 'express-serve-static-core';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

export function Controller(root: PathParams = '/', options?: RouterOptions): ClassDecorator {
  return (constructor: Function): void => {
    ExpressDecoratedRouter.addController(constructor, root, options);
  };
}
