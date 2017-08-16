import {IRoutes} from "./IRoutes";

/**
 * Controller routes
 */
export interface IControllerDefinition {
  all?: IRoutes,
  'delete'?: IRoutes,
  get?: IRoutes,
  head?: IRoutes,
  options?: IRoutes,
  patch?: IRoutes,
  post?: IRoutes,
  put?: IRoutes,
}