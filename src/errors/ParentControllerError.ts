/**
 * Thrown when an input of a @Parent decoration has not been decorated with @Controller
 */
export class ParentControllerError extends Error {
  /** The child controller */
  public readonly child: Function;
  /** The parent controller */
  public readonly parent: Function;

  /**
   * @internal
   * @hidden
   * @param child Child controller
   * @param parent Parent controller
   */
  public constructor(child: Function, parent: Function) {
    super(`Parent controller ${parent.name} as specified by child controller ${child.name} has not been registered`);
    this.child = child;
    this.parent = parent;
  }
}
