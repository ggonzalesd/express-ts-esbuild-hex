import { inject, injectable } from 'tsyringe';

import bcrypt from 'bcrypt';

import { User, UserProps } from '@@core/entities';
import { DataAccess } from '@@core/repositories';
import { CoreError } from '@@core/errors';

import { DEP_DB, DEP_ENVIRONMENT } from '@@const/injection.enum';
import { ConfigService } from '@@app/ports';
import { MailerService } from './Mailer.service';

@injectable()
export class UserService {
  constructor(
    @inject(DEP_ENVIRONMENT) private configService: ConfigService,
    @inject(DEP_DB) private dataAccess: DataAccess,
    @inject(MailerService) private emailService: MailerService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.dataAccess.user.findAll();
  }

  async getUserById(id: string, throws: boolean = true): Promise<User | null> {
    const user = await this.dataAccess.user.findById(id);

    if (!user && throws) {
      throw CoreError.notFound(`User with id ${id} not found`);
    }

    return user;
  }

  async getUserByEmail(
    email: string,
    throws: boolean = true,
  ): Promise<User | null> {
    const user = await this.dataAccess.user.findByEmail(email);

    if (!user && throws) {
      throw CoreError.notFound(`User with email ${email} not found`);
    }

    return user;
  }

  async createUser(userProps: UserProps) {
    return await this.dataAccess.transaction(async (client, access, cancel) => {
      const userUsername = await access.user.findByUsername(
        userProps.username,
        client,
      );
      if (userUsername) {
        throw CoreError.conflict(
          `User with username ${userProps.username} already exists`,
        );
      }

      const userEmail = await access.user.findByEmail(userProps.email, client);
      if (userEmail) {
        cancel();

        return {
          message: 'If email is valid, you will receive a confirmation email',
          data: {
            email: userProps.email,
            username: userProps.username,
            display: userProps.display,
          },
        };
      }

      const verifyemailtoken = crypto.randomUUID();
      console.log({ verifyemailtoken });
      const hashedPassword = await bcrypt.hash(userProps.password, 10);
      const newUser = new User({
        ...userProps,
        password: hashedPassword,
        verifyemailtoken,
      });
      console.log({ newUser });

      const createdUser = await access.user.create(newUser, client);
      console.log({ createdUser });
      if (!createdUser) {
        throw CoreError.internalServerError(
          `Unexpected Error creating user with email ${userProps.email}`,
        );
      }

      // TODO: Send confirmation email
      const params = new URLSearchParams({
        id: createdUser.id!,
        token: verifyemailtoken,
      }).toString();

      const url =
        this.configService.API_URL +
        this.configService.API_BASE +
        '/auth/verify-email?' +
        params;

      this.emailService.verifyEmail(createdUser.email, url);

      return {
        message: 'If email is valid, you will receive a confirmation email',
        data: {
          email: createdUser.email,
          username: createdUser.username,
          display: createdUser.display,
        },
      };
    });
  }
}
