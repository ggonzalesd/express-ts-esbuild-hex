import { createClient } from 'redis';

import type {
  EventSubscriptorService,
  EventPublisherService,
} from '@@app/ports/EventService.port';
import { ConfigService } from '@/application/ports';

export class RedisEventSubscriptorAdapter implements EventSubscriptorService {
  constructor(private connection: ReturnType<typeof createClient>) {}

  sub(event: string, callback: (data: string) => void): Promise<void> {
    return this.connection.subscribe(event, callback);
  }

  unsub(event: string): Promise<void> {
    return this.connection.unsubscribe(event);
  }
}

export class RedisEventPublisherAdapter implements EventPublisherService {
  constructor(private connection: ReturnType<typeof createClient>) {}

  pub(event: string, data: string): Promise<number> {
    return this.connection.publish(event, data);
  }
}

export const redisConnectionFactory = async (configService: ConfigService) => {
  try {
    const redis = createClient({
      url: configService.EVENT_CONNECTION,
    });
    await redis.connect();

    const redisSub = redis.duplicate();
    await redisSub.connect();

    const redisPub = redis.duplicate();
    await redisPub.connect();

    return { redis, redisSub, redisPub };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error connecting to Redis:', error);
    throw new Error('Failed to connect to Redis');
  }
};
