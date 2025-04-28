import { container } from 'tsyringe';
import { Pool as PgPool, PoolClient as PgPoolClient } from 'pg';

import { DEP_ENVIRONMENT } from '@@const/injection.enum';

import type {
  PoolClient,
  PoolConnection,
} from '@@core/repositories/DataAccess.port';

import { type ConfigService } from '@@app/ports/ConfigService.port';

export const psqlPoolFactory: (envConfig: ConfigService) => PoolClient = (
  envConfig: ConfigService,
) => {
  const pool = new PgPool({
    // String connection
    connectionString: envConfig.DB_CONNECTION_STRING,
    max: envConfig.DB_CONNECTION_POOL_MAX,
  });

  const queryFactory =
    (client: PgPool | PgPoolClient) =>
    async <T>(sql: string, ...values: unknown[]): Promise<T[]> => {
      const response = await client.query(sql, values);
      return response.rows as unknown as T[];
    };

  return {
    query: queryFactory(pool),
    connect: async (): Promise<PoolConnection> => {
      const connection = await pool.connect();

      return {
        query: queryFactory(connection),
        begin: async () => {
          await connection.query('BEGIN');
        },
        commit: async () => {
          await connection.query('COMMIT');
        },
        rollback: async () => {
          await connection.query('ROLLBACK');
        },
        release: () => {
          connection.release();
        },
      };
    },
  };
};

export const DEP_PSQL_POOL_FACTORY = 'dep-psql-pool-factory' as const;

container.register<PoolClient>(DEP_PSQL_POOL_FACTORY, {
  useValue: psqlPoolFactory(container.resolve<ConfigService>(DEP_ENVIRONMENT)),
});
