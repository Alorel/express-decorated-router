/// <reference types="express" />
import {Application} from "express";
import {LoggerFunction} from "./interfaces/LoggerFunction";

/**
 * Class for loading controller definitions into your Express app
 */
export declare class ControllerLoader {
    private readonly app;
    log: LoggerFunction;
    /**
     * Constructor
     * @param {Application} app Reference to your Express app
     */
    constructor(app: Application);
    /**
     * Constructor
     * @param {Application} app Reference to your Express app
     * @param {LoggerFunction} logger A function used for logging the loader
     */
    constructor(app: Application, logger: LoggerFunction);
    /**
     * Load a controller
     * @param controllerClass The controller class
     * @param {boolean} clean See {@link parseController}
     */
    loadController(controllerClass: any, clean?: boolean): void;
    /**
     * Load controller classes from the given directories. The classes will be {@link parseController cleaned}.
     * Each file must export only the controller, i.e.
     * <code>
     * class MyController {}
     * export = MyController;
     * </code>
     * @param {string} globs Glob patterns to load from
     */
    loadDirectories(...globs: string[]): void;
    /**
     * Load controller classes from the given directories.
     * Each file must export only the controller, i.e.
     * <code>
     * class MyController {}
     * export = MyController;
     * </code>
     * @param {boolean} clean See {@link parseController}
     * @param {string} globs Glob patterns to load from
     */
    loadDirectories(clean: boolean, ...globs: string[]): void;
}
