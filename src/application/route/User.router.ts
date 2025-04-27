import { CoreError } from '@@core/errors';

import { HttpRequest, HttpResponse, HttpRouter } from '@@app/ports';
import { UserService } from '@@app/services';
import { DataAccess } from '@@core/repositories';

export class UserRouter {
  public router: HttpRouter;
  private userService: UserService;

  constructor(
    private routerFactory: () => HttpRouter,
    dataAccess: DataAccess,
  ) {
    const router = this.routerFactory();
    this.router = router;

    this.userService = new UserService(dataAccess);

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
