import {Request, Response} from 'express';
import {Controller, ControllerMiddleware, DELETE, GET, Parent, POST, RouteMiddleware} from 'express-decorated-router';
import {HttpStatusCode} from '../HttpStatusCode';
import {Middleware} from '../Middleware';
import {BlogHomeController} from './BlogHomeController';

const comments = {
  bar: {name: 'bar', comment: 'Also nice'},
  foo: {name: 'foo', comment: 'Nice'}
};

@Controller('/comments')
@Parent(BlogHomeController)
@ControllerMiddleware(Middleware.comments)
class BlogCommentsController {

  @POST('/')
  @RouteMiddleware(<any>Middleware.jsonBodyParser)
  public static create(req: Request, res: Response) {
    res.status(HttpStatusCode.CREATED)
      .json(req.body);
  }

  @DELETE('/:id')
  public static destroy(req: Request, res: Response) {
    const id: string = req.params.id.toLowerCase();

    if (comments[id]) {
      res.json(comments[id]);
    } else {
      res.status(HttpStatusCode.NOT_FOUND).end();
    }
  }

  @GET('/')
  public static find(_req: Request, res: Response) {
    res.json([comments.foo, comments.bar]);
  }

  @GET('/:id')
  public static findOne(req: Request, res: Response) {
    const id: string = req.params.id.toLowerCase();
    if (comments[id]) {
      res.json(comments[id]);
    } else {
      res.status(HttpStatusCode.NOT_FOUND).end();
    }
  }
}
