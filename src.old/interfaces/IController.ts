import {IControllerDefinition} from "./IControllerDefinition";

/**
 * A parsed controller
 */
export interface IController {
  /**
   * Controller routes
   */
  defs: IControllerDefinition,

  /**
   * Controller root URL
   */
  root: string
}