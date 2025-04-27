import { DataAccess } from '@@core/repositories';

import {
  HttpApplication,
  HttpErrorCallback,
  HttpRequest,
  HttpResponse,
  HttpRouter,
} from './ports/HttpService.port';
import { EventPublisherService } from './ports/EventService.port';
import { UserRouter } from './route';

export class RestApplicationService {
  private userRouter: UserRouter;

  constructor(
    public app: HttpApplication,
    public routerFactory: () => HttpRouter,
    public handlerFactory: () => HttpErrorCallback,
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

    this.app.handler('USE', this.notFound.bind(this));

    this.app.error(this.handlerFactory());
  }

  private async notFound(req: HttpRequest, res: HttpResponse) {
    res.status(404).json({
      ok: false,
      status: 404,
      message: 'Not Found',
      body: null,
    });
  }

  private async healthCheck(_: HttpRequest, res: HttpResponse) {
    const healthText = 'Service running';
    res.send(healthText);
  }
}
