export interface EventSubscriptorService {
  sub: (event: string, callback: (data: string) => void) => Promise<void>;
  unsub: (event: string) => Promise<void>;
}

export interface EventPublisherService {
  pub: (event: string, data: string) => Promise<number>;
}
