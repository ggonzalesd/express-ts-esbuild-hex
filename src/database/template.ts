/* eslint-disable @typescript-eslint/no-unused-vars */
import { type MigrationFn } from 'umzug';
import { type PoolQuery } from '@/domain/repositories/DataAccess.port';

export const up: MigrationFn<PoolQuery> = async (params) => {
  const {
    context: { query },
  } = params;
};

export const down: MigrationFn<PoolQuery> = async (params) => {
  const {
    context: { query },
  } = params;
};
