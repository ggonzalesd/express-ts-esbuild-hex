import { container, inject, injectable } from 'tsyringe';
import { type Pool } from 'mysql2/promise';

import { type DataAccess } from '@/domain/repositories/DataAccess';

import { MysqlProductDB } from './MysqlProduct.database';
import { MysqlTransaction } from './MysqlTransaction';

import { dependecyName } from '@/tools/dependencies.tool';
import { PREFIX_ACCESS_DATA } from '@/constants/dependencies.enum';

import { DEP_MYSQL_POOL } from './Mysql.config';

import envConfig from '@/config/env.config';
import { MysqlUserDB } from './MysqlUser.database';

@injectable()
export class MysqlDataAccess implements DataAccess {
  constructor(
    @inject(DEP_MYSQL_POOL) public pool: Pool,
    @inject(MysqlUserDB) public user: MysqlUserDB,
    @inject(MysqlProductDB) public product: MysqlProductDB,
    @inject(MysqlTransaction)
    public transaction: MysqlTransaction,
  ) {}
}

const dbDialect: typeof envConfig.DB_DIALECT = 'mysql';

export const DEP_MYSQL_DATA_ACCESS = dependecyName(
  PREFIX_ACCESS_DATA,
  dbDialect,
);

container.register<MysqlDataAccess>(DEP_MYSQL_DATA_ACCESS, {
  useClass: MysqlDataAccess,
});
