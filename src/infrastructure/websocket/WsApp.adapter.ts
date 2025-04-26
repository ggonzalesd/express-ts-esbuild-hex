import { createServer } from 'http';
import { Server } from 'ws';

import {
  WsApplication,
  WsClient,
  WsCloseCallback,
  WsConnectionCallback,
  WsErrorCallback,
  WsMessageCallback,
  WsRequest,
} from '@@app/ports/WsService.port';

export class WsAppAdapter<T = unknown> implements WsApplication {
  public readonly rooms: Map<string, Set<WsClient<T>>>;

  private wss: Server | null = null;
  private connectionCallbacks: WsConnectionCallback<T>[] = [];
  private onMessageCallbacks: Map<string, WsMessageCallback<T>> = new Map();
  private onCloseCallbacks: WsCloseCallback<T> | null = null;
  private onErrorCallbacks: WsErrorCallback<T> | null = null;

  constructor() {
    this.rooms = new Map();
  }

  public connection(...callbacks: WsConnectionCallback<T>[]) {
    this.connectionCallbacks = callbacks;
  }

  public message(type: string, callback: WsMessageCallback<T>) {
    this.onMessageCallbacks.set(type, callback);
  }

  close(callback: WsCloseCallback<T>) {
    this.onCloseCallbacks = callback;
  }

  error(callback: WsErrorCallback<T>) {
    this.onErrorCallbacks = callback;
  }

  broadcast(rooms: string | string[] | null, event: string, data: unknown) {
    const _rooms = typeof rooms === 'string' ? [rooms] : rooms;

    if (!_rooms) {
      this.wss?.clients.forEach((client) => {
        client.send(JSON.stringify({ event, data }));
      });
      return;
    }

    for (const room of _rooms) {
      const clients = this.rooms.get(room);
      if (!clients) continue;

      for (const client of clients) {
        client.send(event, data);
      }
    }
  }

  attach(server: ReturnType<typeof createServer>) {
    this.wss = new Server({ server, maxPayload: 1024 * 1024 * 10 });

    this.wss.on('connection', async (ws, req) => {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const path = url.pathname.slice(1);
      const query = Object.fromEntries(url.searchParams.entries());

      // Create a request object
      const request: WsRequest = {
        path,
        headers: req.headers as Record<string, string | undefined>,
        method: req.method || 'GET',
        query,
      };

      // Create a new client instance
      const client: WsClient<T> = {
        send: (event, data) => {
          const message = { event, data: '' };

          if (typeof data === 'string') message.data = data;
          else if (Buffer.isBuffer(data)) message.data = data.toString();
          else message.data = JSON.stringify(data);

          ws.send(JSON.stringify(message));
        },
        close: (code, data) => {
          let message = '';

          if (typeof data === 'string') message = data;
          else if (Buffer.isBuffer(data)) message = data.toString();
          else message = JSON.stringify(data);

          ws.close(code, message);
        },
        context: null as T,
        joins: new Set<string>(),
        join: ((room: string) => {
          if (!this.rooms.has(room)) {
            this.rooms.set(room, new Set());
          }

          const roomSet = this.rooms.get(room);
          if (roomSet == null) return;

          roomSet.add(client);
          client.joins.add(room);
        }).bind(this),
      };

      // Connection middlewares
      let breakIteration = false;
      for (const callback of this.connectionCallbacks) {
        await callback(client, request, () => {
          breakIteration = true;
        });

        if (breakIteration) break;
      }
      if (breakIteration) return;

      ws.on('message', async (data) => {
        let message: unknown = null;
        try {
          message = JSON.parse(data.toString());
        } catch {
          return this.clientSendError(client, 'Message is not valid JSON');
        }

        if (message == null) {
          return this.clientSendError(client, 'Message is null');
        }

        if (typeof message !== 'object' || Array.isArray(message)) {
          return this.clientSendError(client, 'Message is not an object');
        }

        if (!('event' in message && 'data' in message)) {
          return this.clientSendError(client, 'Message is not valid');
        }

        if (
          typeof message.event !== 'string' ||
          typeof message.data !== 'string'
        ) {
          return this.clientSendError(client, 'Message is not valid');
        }

        if (this.onMessageCallbacks.has(message.event)) {
          const callback = this.onMessageCallbacks.get(message.event);
          if (callback) {
            await callback(client, request, message.data);
          }
        }
      });

      ws.on('close', async (code, reason) => {
        if (this.onCloseCallbacks) {
          await this.onCloseCallbacks(client, request, code, reason.toString());
        }

        this.clientRelease(client);
      });

      ws.on('error', async (error) => {
        if (this.onErrorCallbacks) {
          await this.onErrorCallbacks(client, request, error);
        }

        this.clientRelease(client);
      });
    });
  }

  private clientSendError(client: WsClient<T>, error: unknown) {
    if (error instanceof Error) {
      return client.send('error', error.message);
    }
    if (typeof error === 'string') {
      return client.send('error', error);
    }
    if (typeof error === 'object') {
      return client.send('error', JSON.stringify(error));
    }
  }

  private clientRelease(client: WsClient<T>) {
    for (const room of client.joins) {
      const roomSet = this.rooms.get(room);

      if (!roomSet) continue;
      roomSet.delete(client);

      if (roomSet.size === 0) {
        this.rooms.delete(room);
      }
    }
  }
}
