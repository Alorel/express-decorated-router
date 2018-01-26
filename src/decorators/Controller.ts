import {RouterOptions} from 'express';
import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';
import {Util} from '../Util';

export function Controller(root = '/', options?: RouterOptions): ClassDecorator {
  Util.validatePath(root);

  return function(constructor: any): void {
    ExpressDecoratedRouter.addController(constructor, root, options);
  };
}
