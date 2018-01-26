import {Method} from './Method';

export function HEAD(path: string): MethodDecorator {
  return Method('head', path);
}
