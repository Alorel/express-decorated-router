export class Util {
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
