import { inject, singleton } from 'tsyringe';
import {
  WsApplication,
  WsClient,
  WsRequest,
  WsStop,
} from './ports/WsService.port';
import { DEP_WS_APP } from '@/constants';

@singleton()
export class WsApplicationService {
  constructor(
    @inject(DEP_WS_APP) public app: WsApplication<{ username: string }>,
  ) {
    this.app.connection(this.onConnection.bind(this));

    this.app.message('send:message', this.onSendMessage.bind(this));

    this.app.close(this.handlerClose.bind(this));
  }

  onConnection(
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
