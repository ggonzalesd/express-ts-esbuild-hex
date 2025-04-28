import {
  DepBarrier,
  DepCache,
  DepDb,
  DepEnvironment,
  DepErrorHandler,
  DepEventPub,
  DepEventSub,
  DepRoutingApp,
  DepRoutingRouter,
  DepWebsocket,
} from './dependencies.enum';

export const DEP_DB = DepDb.PSQL as const;

export const DEP_ROUTING_APP = DepRoutingApp.EXPRESS as const;
export const DEP_ROUTING_ROUTER = DepRoutingRouter.EXPRESS as const;

export const DEP_ENVIRONMENT = DepEnvironment.DOTENV as const;

export const DEP_BARRIER = DepBarrier.CUSTOM as const;

export const DEP_EVENT_SUB = DepEventSub.REDIS as const;
export const DEP_EVENT_PUB = DepEventPub.REDIS as const;
export const DEP_CACHE = DepCache.REDIS as const;

export const DEP_ERROR_HANDLER = DepErrorHandler.CUSTOM as const;

export const DEP_WEBSOCKET = DepWebsocket.WS as const;
