import {
  HttpApplication,
  HttpRequest,
  HttpResponse,
  HttpRouter,
} from './ports/HttpService.port';
import { EventPublisherService } from './ports/EventService.port';
import { UserRouter } from './route';
import { DataAccess } from '@@core/repositories';

export class RestApplicationService {
  private userRouter: UserRouter;

  constructor(
    public app: HttpApplication,
    public routerFactory: () => HttpRouter,
    public publisher: EventPublisherService,
    public dataAccess: DataAccess,
  ) {
    this.userRouter = new UserRouter(routerFactory, dataAccess);

    this.app.handler('GET /health', this.healthCheck.bind(this));

    this.app.handler('USE /api/v1/users', this.userRouter.router);

    this.app.handler('GET /api/v1/send/:room', async (req, res) => {
      const room = req.params.room;
      const message = req.query.message;

      if (!room || !message) {
        res.status(400).json({
          ok: false,
          message: 'Invalid room or message',
          body: null,
        });
        return;
      }
      publisher.pub('chats', JSON.stringify({ room, message }));
      res.status(200).json({
        ok: true,
        message: 'Message sent',
        body: null,
      });
    });

    this.app.handler('USE', (req, res) => {
      res.status(404).json({
        ok: false,
        message: 'Not Found',
        body: null,
      });
    });
  }

  private async healthCheck(_: HttpRequest, res: HttpResponse) {
    res.json({
      message: 'OK',
    });
  }
}
