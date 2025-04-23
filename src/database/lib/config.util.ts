/* eslint-disable no-console */
import fs from 'node:fs';
import { container } from 'tsyringe';
import { type UmzugStorage } from 'umzug';

import { DEP_DB_DATAACCESS } from '@@const';

import { DataAccess, GenericPool } from '@/domain/repositories/DataAccess.port';

export const getContext = (): GenericPool => {
  const accessData = container.resolve<DataAccess>(DEP_DB_DATAACCESS);
  const context = accessData.pool;

  return {
    query: context.query.bind(context),
  };
};

export const getStorage = (): UmzugStorage<DataAccess['pool']> => ({
  executed: async ({ context }) => {
    const response = await context.query('SELECT * FROM __migrations');

    if (!response || typeof response !== 'object' || !('rows' in response)) {
      console.error('Error: response is not an object', response);
      return [];
    }

    if (!response.rows || !Array.isArray(response.rows)) {
      console.error('Error: response.rows is not an array', response);
      return [];
    }

    const migrations = response.rows.map((row) => row.name);

    return migrations;
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
