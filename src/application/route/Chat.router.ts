import { inject, injectable } from 'tsyringe';

import { HttpRouter } from '@@app/ports';

import { DEP_ROUTING_ROUTER } from '@@const/injection.enum';

@injectable()
export class ChatRouter {
  constructor(@inject(DEP_ROUTING_ROUTER) public router: HttpRouter) {
    this.router = router;
  }
}
