import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

export function DELETE(path: PathParams): MethodDecorator {
  return Method('delete', path);
}
