import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

export function HEAD(path: PathParams): MethodDecorator {
  return Method('head', path);
}
