import {Method} from './Method';

export function PATCH(path: string): MethodDecorator {
  return Method('patch', path);
}
