import { inject, injectable } from 'tsyringe';

import { CoreError } from '@@core/errors';

import { ConfigService, HttpCallback } from '@@app/ports';
import { AuthService } from '@@app/services/Auth.service';

import { DEP_ENVIRONMENT } from '@@const/injection.enum';
import { ConstKeys } from '@@const/keys.enum';
import { UserRoles } from '@@core/entities';
import { authLoginPayloadSchema } from '@@app/schemas/auth.schema';

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(DEP_ENVIRONMENT) private configService: ConfigService,
    @inject(AuthService) private authService: AuthService,
  ) {
    this.authenticated = this.authenticated.bind(this);
    this.withRoles = this.withRoles.bind(this);
  }

  public withRoles =
    (roles: UserRoles[]): HttpCallback =>
    async (req, res, next) => {
      const { role } = authLoginPayloadSchema.parse(req.getUser());

      if (roles.length === 0) {
        return next();
      }

      if (roles.includes(role)) {
        return next();
      }

      throw CoreError.forbidden(
        'User does not have permission to access this resource',
      );
    };

  public authenticated: HttpCallback = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const [kind, bearer] =
      authorization == null
        ? [ConstKeys.AUTHORIZATION_KEY, undefined]
        : authorization.split(' ');

    const cookie = req.cookies[ConstKeys.COOKIE_TOKEN];

    if (bearer == null && cookie == null) {
      throw CoreError.unauthorized('Authorization header or cookie not found');
    }

    let token = cookie;

    if (token == null) {
      token = bearer!;
      if (kind !== ConstKeys.AUTHORIZATION_KEY) {
        throw CoreError.unauthorized('Authorization header is not Bearer');
      }
    }

    const decoded = this.authService.verifyToken(
      token,
      this.configService.JWT_SECRET,
    );

    req.setUser(decoded);

    next();
  };
}
