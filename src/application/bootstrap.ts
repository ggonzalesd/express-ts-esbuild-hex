import { createServer } from 'http';
import { inject, singleton } from 'tsyringe';

import { DEP_CONFIG_ENV, DEP_SERVER_HTTP } from '@@const';
import { RestApplicationService } from './rest.service';
import { ConfigService } from './ports/ConfigService.port';

@singleton()
export class BootstrapApplication {
  constructor(
    @inject(DEP_CONFIG_ENV)
    private config: ConfigService,

    @inject(DEP_SERVER_HTTP)
    private server: ReturnType<typeof createServer>,

    @inject(RestApplicationService)
    private restAppService: RestApplicationService,
  ) {}

  start() {
    this.restAppService.app.attach(this.server);

    this.server.listen(this.config.PORT, () => {
      // eslint-disable-next-line no-console
      console.log('Server is running on ' + this.config.API_URL);
    });
  }
}
