import { HttpRouter } from '@@app/ports/HttpService.port';

export class ProductRouter {
  public router: HttpRouter;

  constructor(private routerFactory: () => HttpRouter) {
    const router = this.routerFactory();
    this.router = router;

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
