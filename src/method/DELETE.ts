import {Method} from './Method';

export function DELETE(path: string): MethodDecorator {
  return Method('delete', path);
}