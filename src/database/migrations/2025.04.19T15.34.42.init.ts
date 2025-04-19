/* eslint-disable no-console */
import { type MigrationFn } from 'umzug';
import { type GenericPool } from '@/domain/repositories/DataAccess';

export const up: MigrationFn<GenericPool> = async (params) => {
  const {
    context: { query },
  } = params;

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ users table created');
};

export const down: MigrationFn<GenericPool> = async (params) => {
  const {
    context: { query },
  } = params;

  await query('DROP TABLE IF EXISTS users');

  console.log('🗑️ users table dropped');
};
