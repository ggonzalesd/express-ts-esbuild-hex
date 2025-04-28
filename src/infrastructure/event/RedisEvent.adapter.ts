import { container, inject, injectable } from 'tsyringe';

import { createClient } from 'redis';

import type {
  EventSubscriptorService,
  EventPublisherService,
  ConfigService,
  BarrierService,
} from '@@app/ports';

import { DEP_BARRIER, DEP_ENVIRONMENT } from '@@const/injection.enum';
import { DepEventPub, DepEventSub } from '@@const/dependencies.enum';

type RedisConnection = ReturnType<typeof createClient>;
type RedisPackage = {
  connection: RedisConnection;
  subscriber: RedisConnection;
  publisher: RedisConnection;
};

export const redisConnectionFactory = (): RedisPackage => {
  const configService = container.resolve<ConfigService>(DEP_ENVIRONMENT);
  const barrierService = container.resolve<BarrierService>(DEP_BARRIER);

  try {
    const connection = createClient({
      url: configService.EVENT_CONNECTION,
      password: configService.EVENT_PASSWORD,
    });
    const subscriber = connection.duplicate();
    const publisher = connection.duplicate();

    barrierService.push('server', 'redis-connection');
    connection.connect().then(() => {
      barrierService.dispatch('server', 'redis-connection');
    });

    barrierService.push('server', 'redis-subscriber');
    subscriber.connect().then(() => {
      barrierService.dispatch('server', 'redis-subscriber');
    });

    barrierService.push('server', 'redis-publisher');
    publisher.connect().then(() => {
      barrierService.dispatch('server', 'redis-publisher');
    });

    return { connection, subscriber, publisher };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error connecting to Redis:', error);
    throw new Error('Failed to connect to Redis');
  }
};
const DEP_REDIS_CONNECTION_FACTORY = 'dep-redis-connection-factory';
container.register<RedisPackage>(DEP_REDIS_CONNECTION_FACTORY, {
  useValue: redisConnectionFactory(),
});

@injectable({ token: DepEventSub.REDIS })
export class RedisEventSubscriptorAdapter implements EventSubscriptorService {
  constructor(
    @inject(DEP_REDIS_CONNECTION_FACTORY) private redisPackage: RedisPackage,
  ) {}

  sub(event: string, callback: (data: string) => void): Promise<void> {
    return this.redisPackage.subscriber.subscribe(event, callback);
  }

  unsub(event: string): Promise<void> {
    return this.redisPackage.subscriber.unsubscribe(event);
  }
}
@injectable({ token: DepEventPub.REDIS })
export class RedisEventPublisherAdapter implements EventPublisherService {
  constructor(
    @inject(DEP_REDIS_CONNECTION_FACTORY) private redisPackage: RedisPackage,
  ) {}

  pub(event: string, data: string): Promise<number> {
    return this.redisPackage.publisher.publish(event, data);
  }
}
