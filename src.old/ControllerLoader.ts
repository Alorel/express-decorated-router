import {Application, RequestHandler, Router} from "express";
import {forEach, isArray, isString} from 'lodash';
import {parseController} from "./fn/parseController";
import {IRoutes} from "./interfaces/IRoutes";
import {sync} from 'glob';
import {LoggerFunction} from "./interfaces/LoggerFunction";

/**
 * Class for loading controller definitions into your Express app
 */
export class ControllerLoader {

  public log: LoggerFunction;

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
   * Constructor
   * @param {Application} app Reference to your Express app
   * @param {LoggerFunction} logger A function used for logging the loader
   */
  constructor(private readonly app: Application, logger?: LoggerFunction) {
    if (logger) {
      this.log = logger;
    }
  }

  /**
   * Load a controller
   * @param controllerClass The controller class
   * @param {boolean} clean See {@link parseController}
   */
  public loadController(controllerClass: any, clean: boolean = true): void {
    this.log(`Parsing controller ${controllerClass.name}`);
    const parsed = parseController(controllerClass, clean);
    const router = Router();

    forEach(parsed.defs, (routes: IRoutes, httpMethod: string) => {
      forEach(routes, (defs: RequestHandler | RequestHandler[], path: string) => {
        if (!isArray(defs)) {
          defs = [defs];
        }

        this.log(`Adding route ${httpMethod.toUpperCase()} ${parsed.root}${path === '/' ? '' : path === '*' ? '/*' : path}`);
        router[httpMethod](path, ...defs);
      });
    });

    this.app.use(parsed.root, router);
  }

  /**
   * Load controller classes from the given directories. The classes will be {@link parseController cleaned}.
   * Each file must export only the controller, i.e.
   * <code>
   * class MyController {}
   * export = MyController;
   * </code>
   * @param {string} globs Glob patterns to load from
   */
  public loadDirectories(...globs: string[]): void;

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
  public loadDirectories(clean: boolean, ...globs: string[]): void;
  public loadDirectories(cleanOrFirstGlob: boolean | string, ...globs: string[]): void {
    let clean: boolean;
    let finalGlobs: string[];

    if (isString(cleanOrFirstGlob)) {
      clean = true;
      finalGlobs = [<string>cleanOrFirstGlob].concat(...globs);
    } else {
      clean = <boolean>cleanOrFirstGlob;
      finalGlobs = globs;
    }

    for (const glob of finalGlobs) {
      const files = sync(glob);

      for (const file of files) {
        this.loadController(require(file), clean);
      }
    }
  }
}

ControllerLoader.prototype.log = () => {
};