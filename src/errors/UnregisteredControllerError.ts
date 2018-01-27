export class UnregisteredControllerError extends Error {
  public readonly controller: Function;

  /** @internal */
  public constructor(controller: Function) {
    super(`Controller class ${controller.name} has not been registered`);
    this.controller = controller;
  }
}
