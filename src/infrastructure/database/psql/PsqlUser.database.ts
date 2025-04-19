import { inject, injectable } from 'tsyringe';
import { type Pool } from 'pg';

import { User } from '@/domain/entities/User.entity';

import { type TransactionContext } from '@/domain/repositories/TransactionManager';
import { type UserRepository } from '@/domain/repositories/UserRepository';

import { DEP_PG_POOL } from './Psql.config';

type Repository = UserRepository<'pg'>;
type CTX = TransactionContext<'pg'>;

@injectable()
export class PsqlUserDB implements Repository {
  constructor(@inject(DEP_PG_POOL) private client: Pool) {}

  async findAll(ctx?: CTX): Promise<User[]> {
    const client = ctx ?? this.client;
    const result = await client.query<User>('SELECT * FROM users');
    return result.rows;
  }

  async findById(id: string, ctx?: CTX): Promise<User | null> {
    const client = ctx ?? this.client;
    const result = await client.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string, ctx?: CTX): Promise<User | null> {
    const client = ctx ?? this.client;
    const result = await client.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0] || null;
  }

  async create(user: User, ctx?: CTX): Promise<number> {
    const client = ctx ?? this.client;

    const result = await client.query<User>(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [user.getName(), user.getEmail(), user.getPassword()],
    );

    return result.rows[0].getId();
  }
}
