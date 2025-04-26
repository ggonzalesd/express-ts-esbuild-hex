import { dependecyName as dn } from '@/tools';

export const PREFIX_DATA_ACCESS = 'data-access';
export const PREFIX_POOL = 'pool';
export const PREFIX_ADAPTER_ROUTER = 'router-adapter';
export const PREFIX_ADAPTER_APP = 'app-adapter';
export const PREFIX_ADAPTER_WS = 'ws-adapter';
export const PREFIX_CONFIG = 'config';

export const ROUTER_USER = 'user';
export const ROUTER_PRODUCT = 'product';

export const ADAPTER_WEB_SOCKET: 'ws' | 'socket.io' = 'ws';
export const ADAPTER_ROUTING: 'express' | 'fastify' = 'express';
export const ADAPTER_DATABASE: 'mysql' | 'postgres' = 'postgres';

export const DEP_SERVER_HTTP = dn('server', 'http');
export const DEP_CONFIG_ENV = dn(PREFIX_CONFIG, 'env');
export const DEP_DB_POOL = dn(PREFIX_POOL, ADAPTER_DATABASE);
export const DEP_DB_DATAACCESS = dn(PREFIX_DATA_ACCESS, ADAPTER_DATABASE);
export const DEP_ROUTING_ROUTER = dn(PREFIX_ADAPTER_ROUTER, ADAPTER_ROUTING);
export const DEP_ROUTING_APP = dn(PREFIX_ADAPTER_APP, ADAPTER_ROUTING);
export const DEP_WS_APP = dn(PREFIX_ADAPTER_WS, ADAPTER_WEB_SOCKET);
