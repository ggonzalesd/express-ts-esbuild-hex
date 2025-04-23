/* eslint-disable no-console */
import { type MigrationFn } from 'umzug';
import { type GenericPool } from '@/domain/repositories/DataAccess.port';

export const up: MigrationFn<GenericPool> = async (params) => {
  const {
    context: { query },
  } = params;

  await query(`CREATE TYPE user_role AS ENUM ('admin', 'user', 'guest');`);
  await query(
    `CREATE TYPE user_state AS ENUM ('active', 'banned', 'deleted');`,
  );

  await query(`CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid(),

    display VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,

    role user_role DEFAULT 'user',
    state user_state DEFAULT 'active',

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY (id),
    CONSTRAINT "users_email_key" UNIQUE (email),
    CONSTRAINT "users_username_key" UNIQUE (username)
  )`);

  console.log('✅ users table created');
};

export const down: MigrationFn<GenericPool> = async (params) => {
  const {
    context: { query },
  } = params;

  await query(`DROP TABLE IF EXISTS users`);
  await query(`DROP TYPE IF EXISTS user_role`);
  await query(`DROP TYPE IF EXISTS user_state`);

  console.log('🗑️ users table dropped');
};
