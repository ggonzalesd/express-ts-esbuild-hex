import { createServer } from 'http';

import { createClient } from 'redis';
import express from 'express';

import {
  ConfigService,
  HttpApplication,
  EventPublisherService,
  EventSubscriptorService,
  WsApplication,
  HttpRouter,
} from '@@app/ports';

import { RestApplicationService } from '@@app/rest.service';
import { WsApplicationService } from '@@app/ws.service';

import { dotenvConfigFactory } from '@@infra/environment';

import {
  RedisEventPublisherAdapter,
  RedisEventSubscriptorAdapter,
} from '@@infra/event';

import { ExpressAppAdapter, ExpressRouterAdapter } from '@@infra/router';
import { WsAppAdapter } from '@@infra/websocket';

async function main() {
  // * Load Environment Variables
  const envConfig: ConfigService = dotenvConfigFactory();

  // * Redis Configuration
  const redis = createClient({
    url: 'redis://localhost:6379',
  });
  await redis.connect();
  const redisSub = redis.duplicate();
  await redisSub.connect();
  const redisPub = redis.duplicate();
  await redisPub.connect();
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

    const routerFactory: () => HttpRouter = () =>
      new ExpressRouterAdapter(express.Router());

    const restApplication = new RestApplicationService(
      httpApp,
      routerFactory,
      eventPublisher,
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
