import { inject, injectable } from 'tsyringe';

import { dependecyName } from '@@tool';
import { ADAPTER_ROUTING, PREFIX_ADAPTER_ROUTER } from '@@const';

import { type HttpRouterPort } from './Http.ports';

@injectable()
export class ProductRouter {
  constructor(
    @inject(dependecyName(PREFIX_ADAPTER_ROUTER, ADAPTER_ROUTING))
    private readonly router: HttpRouterPort,
  ) {
    this.router.get('/', (req, res) => {
      return res.json({
        message: 'Product router',
      });
    });
  }
}
