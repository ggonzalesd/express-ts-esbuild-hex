import { createServer } from 'http';
import { inject, singleton } from 'tsyringe';

import { DEP_ROUTING_APP, DEP_SERVER_HTTP } from '@@const';
import { RestApplicationService } from './rest.service';
import { HttpApplication } from './ports/HttpService.port';

@singleton()
export class BootstrapApplication {
  constructor(
    @inject(DEP_SERVER_HTTP)
    private server: ReturnType<typeof createServer>,
    @inject(RestApplicationService)
    private restAppService: RestApplicationService,
    @inject(DEP_ROUTING_APP)
    private app: HttpApplication,
  ) {}

  start() {
    this.restAppService.start();

    this.app.handler('GET /health', (req, res) => {
      return res.json({
        message: 'OK',
      });
    });

    this.app.attach(this.server);

    this.server.listen(3000, () => {
      // eslint-disable-next-line no-console
      console.log('Server is running on http://localhost:3000');
    });
  }
}
