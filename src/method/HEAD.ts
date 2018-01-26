import {Method} from './Method';

export function OPTIONS(path: string): MethodDecorator {
  return Method('options', path);
}