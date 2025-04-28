import { inject, injectable } from 'tsyringe';

import { HttpRequest, HttpResponse, HttpRouter } from '@@app/ports';

import {
  authLoginPayloadSchema,
  authLoginRequestSchema,
  authRegisterRequestSchema,
  verifyEmailQuerySchema,
} from '@@app/schemas/auth.schema';

import { AuthService } from '@@app/services/Auth.service';

import { DEP_ROUTING_ROUTER } from '@@const/injection.enum';
import { HttpCodes } from '@@const/http.enum';
import { AuthMiddleware } from '@@app/middlewares/Auth.middleware';
import { ConstKeys } from '@@const/keys.enum';

@injectable()
export class AuthRouter {
  constructor(
    @inject(DEP_ROUTING_ROUTER) public router: HttpRouter,
    @inject(AuthService) private authService: AuthService,
    @inject(AuthMiddleware) authMiddleware: AuthMiddleware,
  ) {
    router.handler('POST /login', this.loginRouter.bind(this));
    router.handler('POST /register', this.registerRouter.bind(this));
    router.handler('GET /verify-email', this.verifyEmailRouter.bind(this));
    router.handler(
      'GET /profile',
      authMiddleware.authenticated,
      this.profileRouter.bind(this),
    );
  }

  async verifyEmailRouter(req: HttpRequest, res: HttpResponse) {
    const { id, token } = verifyEmailQuerySchema.parse(req.query);

    await this.authService.verifyEmail(id, token);

    return res.status(HttpCodes.OK).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  }

  async profileRouter(req: HttpRequest, res: HttpResponse) {
    const { id } = authLoginPayloadSchema.parse(req.getUser());

    const user = await this.authService.profile(id);

    return res.status(HttpCodes.OK).json({
      status: 'success',
      message: 'Profile retrieved successfully',
      data: user,
    });
  }

  async loginRouter(req: HttpRequest, res: HttpResponse) {
    const { email, password } = authLoginRequestSchema.parse(req.getBody());

    const token = await this.authService.login(email, password);

    res.setCookie(ConstKeys.COOKIE_TOKEN, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: true, // Set to true if using HTTPS
      sameSite: 'lax', // Set to 'Strict' or 'Lax' based on your needs
      path: '/',
    });

    return res.status(HttpCodes.OK).json({
      status: 'success',
      message: 'Login successful',
      data: { token },
    });
  }

  async registerRouter(req: HttpRequest, res: HttpResponse) {
    const { email, password, display, username } =
      authRegisterRequestSchema.parse(req.getBody());

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
