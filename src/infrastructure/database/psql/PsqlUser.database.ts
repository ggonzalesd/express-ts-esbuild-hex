import { User } from '@@core/entities';

import type {
  UserRepository,
  PoolClient,
  PoolQuery,
} from '@@core/repositories';

export class PsqlUserDB implements UserRepository {
  constructor(private client: PoolClient) {}

  async findAll(ctx?: PoolQuery): Promise<User[]> {
    const client = ctx ?? this.client;

    const result = await client.query<User>('SELECT * FROM users');

    return result;
  }

  async findById(id: string, ctx?: PoolQuery): Promise<User | null> {
    const client = ctx ?? this.client;

    const result = await client.query<User>(
      'SELECT * FROM users WHERE id = $1',
      id,
    );

    return result[0] || null;
  }

  async findByEmail(email: string, ctx?: PoolQuery): Promise<User | null> {
    const client = ctx ?? this.client;

    const result = await client.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    return result[0] || null;
  }

  async create(user: User, ctx?: PoolQuery): Promise<User | null> {
    const client = ctx ?? this.client;

    const result = await client.query<User>(
      `INSERT INTO users
        (display, username, email, password, verified, role, state)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
      user.display,
      user.username,
      user.email,
      user.password,
      user.verified,
      user.role,
      user.state,
    );

    return result[0] || null;
  }
}
