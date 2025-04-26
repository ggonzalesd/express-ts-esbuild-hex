import {
  EventSubscriptorService,
  WsApplication,
  WsClient,
  WsRequest,
  WsStop,
} from './ports/';

export class WsApplicationService {
  constructor(
    public app: WsApplication<{
      username: string;
    }>,
    private subscriptor: EventSubscriptorService,
  ) {
    this.app.connection(this.onConnection.bind(this));

    this.app.message('send:message', this.onSendMessage.bind(this));

    this.app.close(this.handlerClose.bind(this));

    this.subscriptor.sub('chats', this.onEventSendToChat.bind(this));
  }

  async onEventSendToChat(data: string) {
    const { room, message } = JSON.parse(data) as {
      room: string;
      message: string;
    };

    this.app.broadcast([room], 'receive:message', {
      message: {
        username: 'System',
        text: message,
      },
    });
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

  onSendMessage(
    ws: WsClient<{ username: string }>,
    req: WsRequest,
    message: unknown,
  ) {
    this.app.broadcast([...ws.joins], 'receive:message', {
      message: {
        username: ws.context?.username,
        text: message,
      },
    });
  }

  handlerClose(ws: WsClient<{ username: string }>) {
    this.app.broadcast([...ws.joins], 'receive:message:disconnect', {
      message: `${ws.context?.username} has left the room`,
    });
  }
}
