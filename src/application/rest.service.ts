import { inject, singleton } from 'tsyringe';

import { DEP_ROUTING_APP } from '@/constants';

import { HttpApplication } from './ports/HttpService.port';
import { ProductRouter } from './route/Product.router';

@singleton()
export class RestApplicationService {
  constructor(
    @inject(DEP_ROUTING_APP) public app: HttpApplication,
    @inject(ProductRouter) private productRouter: ProductRouter,
  ) {
    this.app.handler('GET /health', (req, res) => {
      res.json({
        message: 'OK',
      });
    });

    this.app.handler('USE /api/v1/products', this.productRouter.router);

    this.app.handler('USE', (req, res) => {
      res.status(404).json({
        ok: false,
        message: 'Not Found',
        body: null,
      });
    });
  }
}
