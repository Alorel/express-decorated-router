import {RequestHandler} from 'express';

export class Util {
  /** @internal */
  public static getAndValidateDescriptor(clazz: any,
                                         key: string | symbol,
                                         descriptor: PropertyDescriptor): PropertyDescriptor {
    if (!descriptor) {
      descriptor = <PropertyDescriptor>Object.getOwnPropertyDescriptor(clazz, key);
    }
    if (!descriptor) {
      throw new Error('Unable to determine property descriptor');
    }
    if (!descriptor.value) {
      throw new Error('Unable to determine property descriptor value');
    }

    return descriptor;
  }

  public static validateMiddleware(middleware: RequestHandler): void {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function');
    }
  }

  public static validatePath(path: string): void {
    if (!path) {
      throw new Error('Path is required');
    } else if (typeof path !== 'string') {
      throw new Error('Path must be a string');
    } else if (path.length > 1 && !path.endsWith('/')) {
      throw new Error('Path must end with a slash');
    } else {
      const firstChar: string = path.charAt(0);

      if (firstChar !== '/') {
        if (firstChar !== '*' && path.length !== 1) {
          throw new Error('Path must start with a slash or be the string "*"');
        }
      }
    }
  }
}
