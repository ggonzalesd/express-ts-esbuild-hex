import { inject, injectable } from 'tsyringe';

import { User } from '@@core/entities';
import { DataAccess } from '@@core/repositories';
import { CoreError } from '@@core/errors';

import { DEP_DB } from '@@const/injection.enum';

@injectable()
export class UserService {
  constructor(@inject(DEP_DB) private dataAccess: DataAccess) {}

  async getAllUsers(): Promise<User[]> {
    return await this.dataAccess.transaction(async () => {
      const users = await this.dataAccess.user.findAll();
      return users;
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.dataAccess.user.findById(id);

    if (!user) {
      throw CoreError.notFound(`User with id ${id} not found`);
    }

    return user;
  }
}
