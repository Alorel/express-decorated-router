import {Method} from './Method';

export function ALL(path: string): MethodDecorator {
  return Method('all', path);
}