import { container, inject, injectable } from 'tsyringe';
import { type Pool } from 'mysql2/promise';

import { dependecyName } from '@@tool';

import { ADAPTER_DATABASE, PREFIX_ACCESS_DATA } from '@@const';

import { type DataAccess } from '@@core/repositories/DataAccess';

import { DEP_MYSQL_POOL } from './Mysql.config';
import { MysqlTransaction } from './MysqlTransaction';
import { MysqlUserDB } from './MysqlUser.database';
import { MysqlProductDB } from './MysqlProduct.database';

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

const database: typeof ADAPTER_DATABASE = 'mysql';

export const DEP_MYSQL_DATA_ACCESS = dependecyName(
  PREFIX_ACCESS_DATA,
  database,
);

container.register<MysqlDataAccess>(DEP_MYSQL_DATA_ACCESS, {
  useClass: MysqlDataAccess,
});
