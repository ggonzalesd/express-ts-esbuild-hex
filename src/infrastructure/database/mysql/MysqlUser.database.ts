import { inject, injectable } from 'tsyringe';
import { type Pool } from 'mysql2/promise';

import { User } from '@@core/entities/User.entity';

import { type TransactionContext } from '@@core/repositories/TransactionManager.port';
import { type UserRepository } from '@@core/repositories/UserRepository.port';

import { DEP_MYSQL_POOL } from './Mysql.config';

type Repository = UserRepository<'mysql'>;
type CTX = TransactionContext<'mysql'>;

@injectable()
export class MysqlUserDB implements Repository {
  constructor(@inject(DEP_MYSQL_POOL) private client: Pool) {}

  async findAll(ctx?: CTX): Promise<User[]> {
    const client = ctx ?? this.client;
    const [rows] = await client.query('SELECT * FROM users');
    return rows as User[];
  }

  async findById(id: string, ctx?: CTX): Promise<User | null> {
    const client = ctx ?? this.client;
    const [rows] = await client.query('SELECT * FROM users WHERE id = ?', [id]);
    return (rows as User[])[0] || null;
  }

  async findByEmail(email: string, ctx?: CTX): Promise<User | null> {
    const client = ctx ?? this.client;
    const [rows] = await client.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    return (rows as User[])[0] || null;
  }

  async create(user: User, ctx?: CTX): Promise<number> {
    const client = ctx ?? this.client;

    const [result] = await client.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING *',
      [user.getName(), user.getEmail(), user.getPassword()],
    );

    const insertId = (result as { insertId: number }).insertId;
    return insertId;
  }
}
