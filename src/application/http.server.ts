import { container } from 'tsyringe';

import { createServer } from 'http';

export const DEP_HTTP_SERVER = 'dep-http-server';

container.register<ReturnType<typeof createServer>>(DEP_HTTP_SERVER, {
  useValue: createServer(),
});
