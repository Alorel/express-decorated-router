/**
 * Annotates the class as a controller
 * @param {string} root The controller root URL
 * @throws See {@link validatePath}
 */
export declare const Controller: (root?: string) => (constructor: any) => void;
