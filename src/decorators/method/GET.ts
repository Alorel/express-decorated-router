import {Method} from './Method';

export function GET(path: string): MethodDecorator {
  return Method('get', path);
}
