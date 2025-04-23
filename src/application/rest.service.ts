import { inject, singleton } from 'tsyringe';

import { DEP_ROUTING_APP } from '@/constants';

import { HttpApplication } from './ports/HttpService.port';

@singleton()
export class RestApplicationService {
  constructor(
    @inject(DEP_ROUTING_APP)
    public app: HttpApplication,
  ) {}

  start() {
    this.app.handler('GET /health', (req, res) => {
      res.json({
        message: 'OK',
      });
    });

    this.app.handler('GET /products', (req, res) => {
      res.json({
        message: 'Products',
      });
    });

    this.app.handler('ALL', (req, res) => {
      res.status(404).json({
        message: 'Not Found',
      });
    });
  }
}
