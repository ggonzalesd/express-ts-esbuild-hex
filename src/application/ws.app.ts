import { inject, injectable } from 'tsyringe';

import {
  EventPublisherService,
  EventSubscriptorService,
  WsApplication,
  WsClient,
  WsRequest,
  WsStop,
} from './ports';

import {
  DEP_EVENT_PUB,
  DEP_EVENT_SUB,
  DEP_WEBSOCKET,
} from '@@const/injection.enum';

@injectable()
export class WebsocketApplicationBootstrap {
  constructor(
    @inject(DEP_WEBSOCKET)
    public app: WsApplication<{
      username: string;
    }>,
    @inject(DEP_EVENT_SUB) private subscriptor: EventSubscriptorService,
    @inject(DEP_EVENT_PUB) private publisher: EventPublisherService,
  ) {
    this.app.connection(this.onConnection.bind(this));

    this.app.message('send:message', this.onClientSendMessage.bind(this));

    this.app.close(this.handlerClose.bind(this));

    // this.subscriptor.sub('chats', this.onEventSendToChat.bind(this));
    this.subscriptor.sub(
      'chats:new-message',
      this.onEventSendMessageToClients.bind(this),
    );
  }

  onClientSendMessage(
    ws: WsClient<{ username: string }>,
    req: WsRequest,
    message: unknown,
  ) {
    const room = ws.joins.values().next().value || null;

    if (!room) {
      ws.close(4000, 'Invalid room');
      return;
    }

    this.publisher.pub(
      'chats:new-message',
      JSON.stringify({
        room,
        message: message + ' In SERVER ' + process.env.PORT,
      }),
    );
  }

  async onEventSendMessageToClients(data: string) {
    const { room, message } = JSON.parse(data) as {
      room: string;
      message: string;
    };

    this.app.broadcast([room], 'receive:message', {
      message,
    });
  }

  async onEventSendToChat(data: string) {
    const { room, message } = JSON.parse(data) as {
      room: string;
      message: string;
    };

    this.publisher.pub('chats:new-message', JSON.stringify({ room, message }));
  }

  async onConnection(
    ws: WsClient<{ username: string }>,
    req: WsRequest,
    stop: WsStop,
  ) {
    const room = req.path;
    const username = req.query['username'];

    if (!username || !room) {
      ws.close(4000, 'Invalid username');
      return stop();
    }

    ws.join(room);
    ws.context = { username };
  }

  handlerClose(ws: WsClient<{ username: string }>) {
    this.app.broadcast([...ws.joins], 'receive:message:disconnect', {
      message: `${ws.context?.username} has left the room`,
    });
  }
}
