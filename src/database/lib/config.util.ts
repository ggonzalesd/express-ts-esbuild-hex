/* eslint-disable no-console */
import fs from 'node:fs';
import { type UmzugStorage } from 'umzug';

import { DataAccess, PoolClient } from '@@core/repositories/DataAccess.port';

import { ConfigService } from '@@app/ports';

import { dotenvConfigFactory } from '@@infra/environment';
import { PsqlDataAccess } from '@@infra/database/psql/PsqlDataAccess';

export const getContext = (): PoolClient => {
  const configService: ConfigService = dotenvConfigFactory();
  const dataAccess: DataAccess = new PsqlDataAccess(configService);
  const context = dataAccess.pool;

  return {
    query: context.query.bind(context),
    connect: context.connect.bind(context),
  };
};

export const getStorage = (): UmzugStorage<PoolClient> => ({
  executed: async ({ context }) => {
    type Migrations = {
      name: string;
      timestamp: string;
    };

    const response = await context.query<Migrations>(
      'SELECT * FROM __migrations',
    );

    return response.map((migration) => migration.name);
  },
  logMigration: async ({ name, context }) => {
    await context.query('INSERT INTO __migrations (name) VALUES ($1)', [name]);
  },
  unlogMigration: async ({ name, context }) => {
    await context.query('DELETE FROM __migrations WHERE name = $1', [name]);
  },
});

export function createTemplateFile(
  name: string,
  templateText: string,
  migrationFolder: string,
) {
  console.log(new Date().toUTCString());
  const timestamp = new Date().toUTCString().replace(/ /g, '_');
  const filename = `${timestamp}_${name}.ts`;
  const filePath = `${migrationFolder}/${filename}`;

  if (fs.existsSync(filePath)) {
    console.error('Error: File already exists', filePath);
    return;
  }
  fs.writeFileSync(filePath, templateText);
  console.log('Template file created:', filePath);
}
