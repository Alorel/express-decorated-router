import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

export function ALL(path: PathParams): MethodDecorator {
  return Method('all', path);
}
