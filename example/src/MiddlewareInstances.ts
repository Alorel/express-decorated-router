import * as morganPkg from "morgan";
import * as bodyParserPkg from "body-parser";
import {NextFunction, Request, Response} from "express";

export const morgan = morganPkg('dev');
export const bodyParser = bodyParserPkg.json();
export const potatoValidator = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) {
    if (req.body.id && typeof req.body.id === 'number' && req.body.size && typeof req.body.size === 'string') {
      setImmediate(next);
      return;
    }
  }

  res.status(400).end();
};
export const disableCache = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', 0);

  setImmediate(next);
};