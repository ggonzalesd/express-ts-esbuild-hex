import { inject, injectable } from 'tsyringe';

import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { UserRoles } from '@@core/entities';
import { CoreError } from '@@core/errors';

import { UserService } from './User.service';
import { DEP_ENVIRONMENT } from '@@const/injection.enum';
import { ConfigService } from '@@app/ports';

@injectable()
export class AuthService {
  constructor(
    @inject(DEP_ENVIRONMENT) private configService: ConfigService,
    @inject(UserService) private userService: UserService,
  ) {}

  public async profile(userId: string) {
    const user = (await this.userService.getUserById(userId))!;

    return {
      id: user.id,
      email: user.email,
      display: user.display,
      username: user.username,
      verified: user.verified,
      role: user.role,
      state: user.state,
      createdAt: user.createdAt,
    };
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userService.getUserByEmail(email, false);

    if (!user) {
      throw CoreError.unauthorized(
        'Invalid email or password, or user is not verified',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw CoreError.unauthorized(
        'Invalid email or password, or user is not verified',
      );
    }

    if (!user.verified) {
      throw CoreError.unauthorized(
        'Invalid email or password, or user is not verified',
      );
    }

    const token = this.generateToken(user.id!, user.role);

    return token;
  }

  public async register(
    email: string,
    password: string,
    display: string,
    username: string,
  ) {
    return await this.userService.createUser({
      email,
      password,
      display,
      username,
    });
  }

  public generateToken(id: string, role: UserRoles): string {
    const token = jwt.sign({ id, role }, this.configService.JWT_SECRET, {
      expiresIn: 1 * 60 * 60,
    });

    return token;
  }

  public verifyToken(token: string, secret: string) {
    try {
      const decoded = jwt.verify(token, secret, {
        ignoreExpiration: false,
      });
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw CoreError.unauthorized('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw CoreError.unauthorized('Invalid token');
      }
      if (error instanceof jwt.NotBeforeError) {
        throw CoreError.unauthorized('Token not active');
      }
      throw CoreError.unauthorized('Token not valid');
    }
  }
}
