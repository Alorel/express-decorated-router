import {PathParams} from 'express-serve-static-core';
import {ExpressDecoratedRouter} from '../../ExpressDecoratedRouter';

export function Method(httpMethod: string, path: PathParams): MethodDecorator {
  return (target: any, _key: string | symbol, descriptor: PropertyDescriptor): void => {
    if (!descriptor) {
      throw new Error('Unable to get property descriptor');
    }
    if (!descriptor.value) {
      throw new Error('Unable to determine property descriptor value');
    }

    ExpressDecoratedRouter.addRoute(target, httpMethod, path, descriptor.value);
  };
}
