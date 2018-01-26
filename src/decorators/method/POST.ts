import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

export function POST(path: PathParams): MethodDecorator {
  return Method('post', path);
}
