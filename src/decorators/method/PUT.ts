import {Method} from './Method';

export function PUT(path: string): MethodDecorator {
  return Method('put', path);
}