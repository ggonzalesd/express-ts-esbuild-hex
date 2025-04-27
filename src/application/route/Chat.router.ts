import { HttpRouter } from '@@app/ports';

export class ChatRouter {
  public router: HttpRouter;

  constructor(private routerFactory: () => HttpRouter) {
    const router = this.routerFactory();
    this.router = router;
  }
}
