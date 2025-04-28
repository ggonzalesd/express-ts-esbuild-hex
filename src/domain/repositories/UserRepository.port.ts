import { type PoolQuery } from '.';
import { User } from '@@core/entities';

export interface UserRepository {
  findAll(ctx?: PoolQuery): Promise<User[]>;

  findById(id: string, ctx?: PoolQuery): Promise<User | null>;
  findByEmail(email: string, ctx?: PoolQuery): Promise<User | null>;
  findByUsername(username: string, ctx?: PoolQuery): Promise<User | null>;

  create(user: User, ctx?: PoolQuery): Promise<User | null>;
  update(user: User, ctx?: PoolQuery): Promise<User | null>;
}
