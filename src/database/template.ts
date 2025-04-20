/* eslint-disable @typescript-eslint/no-unused-vars */
import { type MigrationFn } from 'umzug';
import { type GenericPool } from '@@core/repositories/DataAccess';

export const up: MigrationFn<GenericPool> = async (params) => {
  const {
    context: { query },
  } = params;
};

export const down: MigrationFn<GenericPool> = async (params) => {
  const {
    context: { query },
  } = params;
};
