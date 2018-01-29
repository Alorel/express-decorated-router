import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

/**
 * Use this handler for the POST HTTP method
 * @param path The path this handler will be responsible for
 */
export function POST(path: PathParams): MethodDecorator {
  return Method('post', path);
}
