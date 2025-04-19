import 'reflect-metadata';

import path from 'node:path';
import fs from 'node:fs';

import { Umzug } from 'umzug';

import '@/infrastructure/database/psql/PsqlDataAccess';
import '@/infrastructure/database/mysql/MysqlDataAccess';

import { getContext, getStorage } from './lib/config.util';
import { GenericPool } from '@/domain/repositories/DataAccess';
import { run } from './lib/client.util';

async function start() {
  // #region Get context from the container
  const context = getContext();
  // #endregion

  // #region Get template typescript script // from file as string
  const templateFilename = path.join(__dirname, 'template.ts');
  const templateText = fs.readFileSync(templateFilename, 'utf-8');
  // #endregion

  // #region Get Create Migration
  const migrationFolder = path.join(__dirname, 'migrations');
  // #endregion

  // #region Get Storage
  const storage = getStorage();
  // #endregion

  const umzug = new Umzug<GenericPool>({
    migrations: {
      glob: path.join(__dirname, 'migrations', '*.*.*T*.*.*.*.ts'),
    },
    context,
    storage,
    create: {
      folder: migrationFolder,
      template: (filePath) => [[filePath, templateText]],
    },
    logger: console,
  });

  run({ context, umzug });
}

start();
