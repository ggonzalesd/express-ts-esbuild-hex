/* eslint-disable no-console */
import { type MigrationFn } from 'umzug';
import { type GenericPool } from '@@core/repositories/DataAccess';

export const up: MigrationFn<GenericPool> = async (params) => {
  const {
    context: { query },
  } = params;

  // add credits column to users table
  await query(`
    ALTER TABLE users
    ADD COLUMN credits INT DEFAULT 0
  `);
  console.log('✅ credits column added to users table');
};

export const down: MigrationFn<GenericPool> = async (params) => {
  const {
    context: { query },
  } = params;

  // remove credits column from users table
  await query(`
    ALTER TABLE users
    DROP COLUMN credits
  `);
  console.log('🗑️ credits column removed from users table');
};
