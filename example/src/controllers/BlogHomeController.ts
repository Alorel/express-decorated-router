import {Request, Response} from 'express';
import {Controller, ControllerMiddleware, GET} from 'express-decorated-router';
import {Middleware} from '../Middleware';

@Controller('/blog')
@ControllerMiddleware(Middleware.blogs)
export class BlogHomeController {

  @GET('/')
  public static index(_req: Request, res: Response): void {
    res.contentType('text/html')
      .end('<span>The fanciest of blog homepages</span>');
  }
}
