import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

export function GET(path: PathParams): MethodDecorator {
  return Method('get', path);
}
