import { inject, injectable } from 'tsyringe';
import { type Pool } from 'pg';

import { dependecyName } from '@@tool';
import { ADAPTER_DATABASE, PREFIX_DATA_ACCESS } from '@@const';

import { type DataAccess } from '@@core/repositories/DataAccess.port';

import { DEP_PG_POOL } from './Psql.config';
import { PsqlTransaction } from './PsqlTransaction';
import { PsqlUserDB } from './PsqlUser.database';
import { PsqlProductDB } from './PsqlProduct.database';

const database: typeof ADAPTER_DATABASE = 'postgres';

export const DEP_PSQL_DATA_ACCESS = dependecyName(PREFIX_DATA_ACCESS, database);
@injectable({ token: DEP_PSQL_DATA_ACCESS })
export class PsqlDataAccess implements DataAccess {
  constructor(
    @inject(DEP_PG_POOL) public pool: Pool,
    @inject(PsqlUserDB) public user: PsqlUserDB,
    @inject(PsqlProductDB) public product: PsqlProductDB,
    @inject(PsqlTransaction) public transaction: PsqlTransaction,
  ) {}
}
