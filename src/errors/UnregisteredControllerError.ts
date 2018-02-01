/**
 * Thrown when a class decorated with @Parent was not annotated with @Controller
 */
export class UnregisteredControllerError extends Error {
  /** The controller */
  public readonly controller: Function;

  /**
   * @internal
   * @hidden
   * @param clazz The class
   */
  public constructor(clazz: Function) {
    super(`Controller class ${clazz.name} has not been registered`);
    this.controller = clazz;
  }
}
