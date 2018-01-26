import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

export function OPTIONS(path: PathParams): MethodDecorator {
  return Method('options', path);
}
