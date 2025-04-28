import { inject, injectable } from 'tsyringe';

import { DEP_PSQL_POOL_FACTORY } from './Psql.config';

import { User } from '@@core/entities';

import type {
  UserRepository,
  PoolClient,
  PoolQuery,
} from '@@core/repositories';

@injectable()
export class PsqlUserDB implements UserRepository {
  constructor(@inject(DEP_PSQL_POOL_FACTORY) private client: PoolClient) {}

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

    return result[0] ? new User(result[0]) : null;
  }

  async findByEmail(email: string, ctx?: PoolQuery): Promise<User | null> {
    const client = ctx ?? this.client;

    const result = await client.query<User>(
      'SELECT * FROM users WHERE email = $1',
      email,
    );

    return result[0] ? new User(result[0]) : null;
  }

  async findByUsername(
    username: string,
    ctx?: PoolQuery,
  ): Promise<User | null> {
    const client = ctx ?? this.client;

    const result = await client.query<User>(
      'SELECT * FROM users WHERE username = $1',
      username,
    );

    return result[0] ? new User(result[0]) : null;
  }

  async create(user: User, ctx?: PoolQuery): Promise<User | null> {
    const client = ctx ?? this.client;

    const result = await client.query<User>(
      `INSERT INTO users
        (display, username, email, password, verified, role, state, verifyemailtoken)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
      user.display,
      user.username,
      user.email,
      user.password,
      user.verified,
      user.role,
      user.state,
      user.verifyemailtoken,
    );

    return result[0] ? new User(result[0]) : null;
  }

  async update(user: User, ctx?: PoolQuery): Promise<User | null> {
    const client = ctx ?? this.client;

    const result = await client.query<User>(
      `UPDATE users
        SET display = $1,
            username = $2,
            email = $3,
            password = $4,
            verified = $5,
            role = $6,
            state = $7,
            verifyemailtoken = $8
      WHERE id = $9
        RETURNING *`,
      user.display,
      user.username,
      user.email,
      user.password,
      user.verified,
      user.role,
      user.state,
      user.verifyemailtoken,
      user.id,
    );

    return result[0] || null;
  }
}
