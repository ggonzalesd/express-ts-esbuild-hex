import { createServer } from 'http';

export type WsMessage = {
  event: string;
  data: string;
};

export interface WsClient<T = unknown> {
  context: T;
  joins: Set<string>;

  join: (room: string) => void;
  send: (event: string, data: unknown) => void;
  close: (code?: number, data?: unknown) => void;
}

export type WsRequest = {
  path: string;
  method: string;
  query: Record<string, string | null | undefined>;
  headers: Record<string, string | undefined>;
};

export type WsStop = () => void;

export type WsConnectionCallback<T = unknown> = (
  ws: WsClient<T>,
  req: WsRequest,
  next: WsStop,
) => void | Promise<void>;

export type WsMessageCallback<T = unknown> = (
  ws: WsClient<T>,
  req: WsRequest,
  message: unknown,
) => void | Promise<void>;

export type WsCloseCallback<T = unknown> = (
  ws: WsClient<T>,
  req: WsRequest,
  code: number,
  reason: string,
) => void | Promise<void>;

export type WsErrorCallback<T = unknown> = (
  ws: WsClient<T>,
  req: WsRequest,
  error?: unknown,
) => void | Promise<void>;

export interface WsApplication<T = unknown> {
  readonly rooms: Map<string, Set<WsClient<T>>>;

  connection: (
    ...callbacks: Array<WsConnectionCallback<T>>
  ) => void | Promise<void>;
  message: (
    event: string,
    callback: WsMessageCallback<T>,
  ) => void | Promise<void>;
  close: (callback: WsCloseCallback<T>) => void | Promise<void>;
  error: (callback: WsErrorCallback<T>) => void | Promise<void>;

  attach: (server: ReturnType<typeof createServer>) => void;

  broadcast: (
    rooms: string | string[] | null,
    event: string,
    data: unknown,
  ) => void | Promise<void>;
}
