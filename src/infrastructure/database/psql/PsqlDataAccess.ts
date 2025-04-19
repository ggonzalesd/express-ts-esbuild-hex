import { inject, container, injectable } from 'tsyringe';
import { Pool } from 'pg';

import { type DataAccess } from '@/domain/repositories/DataAccess';

import { PsqlUserDB } from './PsqlUser.database';
import { PsqlProductDB } from './PsqlProduct.database';
import { PsqlTransaction } from './PsqlTransaction';

import { dependecyName } from '@/tools/dependencies.tool';
import { PREFIX_ACCESS_DATA } from '@/constants/dependencies.enum';
import { DEP_PG_POOL } from './Psql.config';

import envConfig from '@/config/env.config';

@injectable()
export class PsqlDataAccess implements DataAccess {
  constructor(
    @inject(DEP_PG_POOL) public pool: Pool,
    @inject(PsqlUserDB) public user: PsqlUserDB,
    @inject(PsqlProductDB) public product: PsqlProductDB,
    @inject(PsqlTransaction) public transaction: PsqlTransaction,
  ) {}
}

const dbDialect: typeof envConfig.DB_DIALECT = 'postgres';

export const DEP_PSQL_DATA_ACCESS = dependecyName(
  PREFIX_ACCESS_DATA,
  dbDialect,
);

container.register<PsqlDataAccess>(DEP_PSQL_DATA_ACCESS, {
  useClass: PsqlDataAccess,
});
