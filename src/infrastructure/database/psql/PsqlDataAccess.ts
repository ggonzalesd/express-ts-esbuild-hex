import { inject, injectable } from 'tsyringe';
import { type Pool } from 'pg';

import { type DataAccess } from '@/domain/repositories/DataAccess';

import { PsqlUserDB } from './PsqlUser.database';
import { PsqlProductDB } from './PsqlProduct.database';
import { PsqlTransaction } from './PsqlTransaction';

import { dependecyName } from '@/tools/dependencies.tool';
import {
  ADAPTER_DATABASE,
  PREFIX_ACCESS_DATA,
} from '@/constants/dependencies.enum';

import { DEP_PG_POOL } from './Psql.config';

const database: typeof ADAPTER_DATABASE = 'postgres';

export const DEP_PSQL_DATA_ACCESS = dependecyName(PREFIX_ACCESS_DATA, database);
@injectable({ token: DEP_PSQL_DATA_ACCESS })
export class PsqlDataAccess implements DataAccess {
  constructor(
    @inject(DEP_PG_POOL) public pool: Pool,
    @inject(PsqlUserDB) public user: PsqlUserDB,
    @inject(PsqlProductDB) public product: PsqlProductDB,
    @inject(PsqlTransaction) public transaction: PsqlTransaction,
  ) {}
}
