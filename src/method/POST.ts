import {Method} from './Method';

export function POST(path: string): MethodDecorator {
  return Method('post', path);
}