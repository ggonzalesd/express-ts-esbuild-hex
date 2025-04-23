import { createServer } from 'http';
import { container } from 'tsyringe';

import { DEP_SERVER_HTTP } from '@@const';

const server = createServer();

container.register<typeof server>(DEP_SERVER_HTTP, {
  useValue: server,
});
