import { User } from '../entities/User.entity';
import { PoolQuery } from './DataAccess.port';

export interface UserRepository {
  findAll(ctx?: PoolQuery): Promise<User[]>;

  findById(id: string, ctx?: PoolQuery): Promise<User | null>;
  findByEmail(email: string, ctx?: PoolQuery): Promise<User | null>;

  create(user: User, ctx?: PoolQuery): Promise<string | null>;
}
