import {IController} from "../interfaces/IController";

/**
 * Parse the controller into a loadable form
 * @param router A class with routes defined
 * @param {boolean} clean If set to true (default), cleans up the class created by the routing decorators and making it impossible to parse the class again.
 * @returns {IController} A controller definition that's usable by the loader
 */
export declare const parseController: (router: any, clean?: boolean) => IController;
