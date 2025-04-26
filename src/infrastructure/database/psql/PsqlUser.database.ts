import { PoolClient, PoolQuery } from '@/domain/repositories/DataAccess.port';
import { User } from '@@core/entities/User.entity';

import { type UserRepository } from '@@core/repositories/UserRepository.port';

export class PsqlUserDB implements UserRepository {
  constructor(private client: PoolClient) {}

  async findAll(ctx?: PoolQuery): Promise<User[]> {
    const client = ctx ?? this.client;
    const result = await client.query<User[]>('SELECT * FROM users');
    return result;
  }

  async findById(id: string, ctx?: PoolQuery): Promise<User | null> {
    const client = ctx ?? this.client;
    const result = await client.query<User[]>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    return result[0] || null;
  }

  async findByEmail(email: string, ctx?: PoolQuery): Promise<User | null> {
    const client = ctx ?? this.client;
    const result = await client.query<User[]>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result[0] || null;
  }

  async create(user: User, ctx?: PoolQuery): Promise<string> {
    const client = ctx ?? this.client;

    const result = await client.query<User>(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [user.getUsername(), user.getEmail(), user.getPassword()],
    );

    return result.getId();
  }
}
