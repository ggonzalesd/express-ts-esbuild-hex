import { inject, injectable } from 'tsyringe';

import { CoreError } from '@@core/errors';

import { HttpRequest, HttpResponse, HttpRouter } from '@@app/ports';
import { UserService } from '@@app/services';

import { DEP_ROUTING_ROUTER } from '@@const/injection.enum';

@injectable()
export class UserRouter {
  constructor(
    @inject(DEP_ROUTING_ROUTER) public router: HttpRouter,
    @inject(UserService) private userService: UserService,
  ) {
    router.handler('GET /', this.getAllUsersRouter.bind(this));
    router.handler('GET /:id', this.getUserByIdRouter.bind(this));
  }

  async getAllUsersRouter(_: HttpRequest, res: HttpResponse) {
    const users = await this.userService.getAllUsers();
    return res.json(users);
  }

  async getUserByIdRouter(req: HttpRequest, res: HttpResponse) {
    const { id } = req.params;

    if (!id) {
      throw CoreError.badRequest('User ID is required');
    }

    const user = await this.userService.getUserById(id);
    return res.json(user);
  }
}
