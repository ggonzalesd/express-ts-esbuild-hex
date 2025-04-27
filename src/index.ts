import { createServer } from 'http';

import { DataAccess } from '@@core/repositories';

import {
  ConfigService,
  HttpApplication,
  EventPublisherService,
  EventSubscriptorService,
  WsApplication,
} from '@@app/ports';

import { RestApplicationService } from '@@app/rest.service';
import { WsApplicationService } from '@@app/ws.service';

import { dotenvConfigFactory } from '@@infra/environment';

import {
  redisConnectionFactory,
  RedisEventPublisherAdapter,
  RedisEventSubscriptorAdapter,
} from '@@infra/event';

import {
  expreeRouterFactory,
  errorHandlerFactory,
  ExpressAppAdapter,
} from '@@infra/router';
import { WsAppAdapter } from '@@infra/websocket';
import { PsqlDataAccess } from '@@infra/database/psql';

async function main() {
  // * Load Environment Variables
  const envConfig: ConfigService = dotenvConfigFactory();

  // * DataAccess Configuration
  const dataAccess: DataAccess = new PsqlDataAccess(envConfig);

  // * Redis Configuration
  const { redisSub, redisPub } = await redisConnectionFactory(envConfig);
  const eventSubscriptor: EventSubscriptorService =
    new RedisEventSubscriptorAdapter(redisSub);
  const eventPublisher: EventPublisherService = new RedisEventPublisherAdapter(
    redisPub,
  );

  // * HTTP Server Configuration
  const server = createServer();

  // * Rest Configuration
  {
    const httpApp: HttpApplication = new ExpressAppAdapter(envConfig);

    const restApplication = new RestApplicationService(
      httpApp,
      expreeRouterFactory,
      errorHandlerFactory,
      eventPublisher,
      dataAccess,
    );

    restApplication.app.attach(server);
  }

  // * Websocket Configuration
  {
    const wsApp: WsApplication<{ username: string }> = new WsAppAdapter();

    const websocketApplication = new WsApplicationService(
      wsApp,
      eventSubscriptor,
    );

    websocketApplication.app.attach(server);
  }

  // * Start server
  server.listen(envConfig.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Server is running on ${envConfig.PROTOCOL}://${envConfig.HOST}:${envConfig.PORT}`,
    );
  });
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Server started');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Error starting server:', err);
  });
