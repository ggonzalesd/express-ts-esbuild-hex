import { User } from '../entities/User.entity';
import {
  DatabaseType,
  type TransactionContext,
} from './TransactionManager.port';

export interface UserRepository<T extends DatabaseType = DatabaseType> {
  findAll(ctx?: TransactionContext<T>): Promise<User[]>;

  findById(id: string, ctx?: TransactionContext<T>): Promise<User | null>;
  findByEmail(email: string, ctx?: TransactionContext<T>): Promise<User | null>;

  create(user: User, ctx?: TransactionContext<T>): Promise<number | null>;
}
