import {Request, Response} from 'express';
import {Controller, ControllerMiddleware, GET, POST, RouteMiddleware} from 'express-decorated-router';
import {HttpStatusCode} from '../HttpStatusCode';
import {Middleware} from '../Middleware';

@Controller('/user')
@ControllerMiddleware(Middleware.forAllUsers)
export class UserController {

  @POST('/')
  @RouteMiddleware(Middleware.jsonBodyParser)
  public static create(req: Request, res: Response): void {
    res.status(HttpStatusCode.CREATED);
    res.json(req.body);
  }

  @GET('/')
  public static find(_req: Request, res: Response): void {
    res.json([{name: 'foo'}, {name: 'bar'}]);
  }

  @GET('/:id')
  public static findOne(req: Request, res: Response) {
    switch (req.params.id.toLowerCase()) {
      case 'foo':
        return res.json({name: 'foo'});
      case 'bar':
        return res.json({name: 'bar'});
      default:
        res.status(HttpStatusCode.NOT_FOUND)
          .end();
    }
  }
}
