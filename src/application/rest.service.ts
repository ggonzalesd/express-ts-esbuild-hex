import { HttpApplication, HttpRouter } from './ports/HttpService.port';
import { ProductRouter } from './route/Product.router';
import { EventPublisherService } from './ports/EventService.port';

export class RestApplicationService {
  private productRouter: ProductRouter;

  constructor(
    public app: HttpApplication,
    public routerFactory: () => HttpRouter,
    public publisher: EventPublisherService,
  ) {
    this.productRouter = new ProductRouter(routerFactory);

    this.app.handler('GET /health', (req, res) => {
      res.json({
        message: 'OK',
      });
    });

    this.app.handler('USE /api/v1/products', this.productRouter.router);

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
}
