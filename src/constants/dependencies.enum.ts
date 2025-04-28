export enum DepDb {
  PSQL = 'dep-db-psql',
  MYSQL = 'dep-db-mysql',
}

export enum DepRoutingApp {
  EXPRESS = 'dep-routing-app-express',
  FASTIFY = 'dep-routing-app-fastify',
}

export enum DepRoutingRouter {
  EXPRESS = 'dep-routing-router-express',
  FASTIFY = 'dep-routing-router-fastify',
}

export enum DepEnvironment {
  DOTENV = 'dep-environment-dotenv',
}

export enum DepBarrier {
  CUSTOM = 'dep-barrier-custom',
}

export enum DepEventPub {
  REDIS = 'dep-event-redis-pub',
}
export enum DepEventSub {
  REDIS = 'dep-event-redis-sub',
}

export enum DepCache {
  REDIS = 'dep-cache-redis',
}

export enum DepErrorHandler {
  CUSTOM = 'dep-error-handler-custom',
}

export enum DepWebsocket {
  WS = 'dep-websocket-ws',
  IO = 'dep-websocket-io',
}
