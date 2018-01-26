import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

export function PUT(path: PathParams): MethodDecorator {
  return Method('put', path);
}
