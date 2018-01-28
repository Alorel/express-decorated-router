import * as bodyParser from 'body-parser';
import {Request, RequestHandler, Response} from 'express';
import {LazyGetter} from 'typescript-lazy-get-decorator';

export class Middleware {

  @LazyGetter()
  public static get blogs(): RequestHandler {
    return (_req: Request, res: Response, next: any) => {
      res.header('is-blog', '1');
      next();
    };
  }

  @LazyGetter()
  public static get comments(): RequestHandler {
    return (_req: Request, res: Response, next: any) => {
      res.header('is-comment', '1');
      next();
    };
  }

  @LazyGetter()
  public static get forAllUsers(): RequestHandler {
    return (_req: Request, res: Response, next: any) => {
      res.header('is-user', '1');
      next();
    };
  }

  @LazyGetter()
  public static get jsonBodyParser(): RequestHandler {
    return bodyParser.json();
  }
}
