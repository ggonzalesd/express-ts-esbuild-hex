import { inject, injectable } from 'tsyringe';
import { RestApplicationBootstrap } from './rest.app';
import { WebsocketApplicationBootstrap } from './ws.app';
import { DEP_HTTP_SERVER } from './http.server';
import { createServer } from 'http';
import { DEP_BARRIER, DEP_ENVIRONMENT } from '@@const/injection.enum';
import { BarrierService, ConfigService } from './ports';

@injectable()
export class MainBootstrap {
  private alreadyStarted = false;

  constructor(
    @inject(DEP_ENVIRONMENT) private env: ConfigService,
    @inject(DEP_HTTP_SERVER) private server: ReturnType<typeof createServer>,
    @inject(RestApplicationBootstrap)
    rest: RestApplicationBootstrap,
    @inject(WebsocketApplicationBootstrap)
    ws: WebsocketApplicationBootstrap,
    @inject(DEP_BARRIER) barrier: BarrierService,
  ) {
    rest.app.attach(server);
    ws.app.attach(server);

    barrier.on('server', this.startServer.bind(this));
  }

  startServer() {
    if (this.alreadyStarted) {
      return;
    }
    this.alreadyStarted = true;

    this.server.listen(this.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${this.env.PORT}`);
    });
  }
}
