import {ExpressDecoratedRouter} from '../../ExpressDecoratedRouter';
import {Util} from '../../Util';

export function Method(httpMethod: string, path: string): MethodDecorator {
  Util.validatePath(path);

  return function(target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
    if (!descriptor) {
      descriptor = <PropertyDescriptor>Object.getOwnPropertyDescriptor(target, key);
    }
    if (!descriptor) {
      throw new Error('Unable to get property descriptor');
    }
    if (!descriptor.value) {
      throw new Error('Unable to determine property descriptor value');
    }

    ExpressDecoratedRouter.addRoute(target, httpMethod, path, descriptor.value);
  };
}
