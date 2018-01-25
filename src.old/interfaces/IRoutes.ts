import {RequestHandler} from "express";

/**
 * Controller routes ready to be loaded
 */
export interface IRoutes {
  [k: string]: RequestHandler | RequestHandler[]
}