import { inject, injectable } from 'tsyringe';

import { HttpRequest, HttpResponse, HttpRouter } from '@@app/ports';

import {
  authLoginRequestSchema,
  authRegisterRequestSchema,
} from '@@app/schemas/auth.schema';

import { AuthService } from '@@app/services/Auth.service';

import { DEP_ROUTING_ROUTER } from '@@const/injection.enum';
import { HttpCodes } from '@@const/http.enum';

@injectable()
export class AuthRouter {
  constructor(
    @inject(DEP_ROUTING_ROUTER) public router: HttpRouter,
    @inject(AuthService) private authService: AuthService,
  ) {
    router.handler('POST /login', this.loginRouter.bind(this));
    router.handler('POST /register', this.registerRouter.bind(this));
  }

  async loginRouter(req: HttpRequest, res: HttpResponse) {
    const { email, password } = authLoginRequestSchema.parse(req.body);

    const token = await this.authService.login(email, password);

    return res.status(HttpCodes.OK).json({
      status: 'success',
      message: 'Login successful',
      data: { token },
    });
  }

  async registerRouter(req: HttpRequest, res: HttpResponse) {
    const { email, password, display, username } =
      authRegisterRequestSchema.parse(req.body);

    const result = await this.authService.register(
      email,
      password,
      display,
      username,
    );

    return res.status(HttpCodes.CREATED).json({
      status: 'success',
      message: result.message,
      data: result.data,
    });
  }
}
