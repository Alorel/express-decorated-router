import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

export function PATCH(path: PathParams): MethodDecorator {
  return Method('patch', path);
}
