import { createClient } from 'redis';

import type {
  EventSubscriptorService,
  EventPublisherService,
} from '@@app/ports/EventService.port';

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
