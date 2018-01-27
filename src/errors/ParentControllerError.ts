export class ParentControllerError extends Error {
  public readonly child: Function;
  public readonly parent: Function;

  /** @internal */
  public constructor(child: Function, parent: Function) {
    super(`Parent controller ${parent.name} as specified by child controller ${child.name} has not been registered`);
    this.child = child;
    this.parent = parent;
  }
}
