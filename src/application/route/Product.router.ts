import { inject, singleton } from 'tsyringe';

import { DEP_ROUTING_ROUTER } from '@@const';

import { HttpRouter } from '@@app/ports/HttpService.port';

@singleton()
export class ProductRouter {
  constructor(
    @inject(DEP_ROUTING_ROUTER)
    public router: HttpRouter,
  ) {
    router.handler('GET /', (req, res) => {
      return res.json({
        message: 'Products',
      });
    });

    router.handler('GET /:id', (req, res) => {
      const { id } = req.params;
      return res.json({
        message: `Product #${id}`,
      });
    });

    router.handler('POST /', (req, res) => {
      const { name, price } = req.body as {
        name: string;
        price: number;
      };
      return res.json({
        message: `Product ${name} with price ${price} created`,
      });
    });
  }
}
