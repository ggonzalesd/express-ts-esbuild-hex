import { inject, injectable } from 'tsyringe';

import {
  HttpApplication,
  HttpErrorCallback,
  HttpRequest,
  HttpResponse,
  EventPublisherService,
} from './ports';

import { UserRouter } from './route';

import {
  DEP_ERROR_HANDLER,
  DEP_EVENT_PUB,
  DEP_ROUTING_APP,
} from '@@const/injection.enum';
import { AuthRouter } from './route/Auth.router';

@injectable()
export class RestApplicationBootstrap {
  constructor(
    @inject(DEP_ROUTING_APP) public app: HttpApplication,
    @inject(AuthRouter) private authRouter: AuthRouter,
    @inject(UserRouter) private userRouter: UserRouter,
    @inject(DEP_ERROR_HANDLER) errorHandler: HttpErrorCallback,
    @inject(DEP_EVENT_PUB) publisher: EventPublisherService,
  ) {
    this.app.handler('GET /health', this.healthCheck.bind(this));

    this.app.handler('USE /api/v1/auth', this.authRouter.router);
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

    this.app.error(errorHandler);
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
