import 'reflect-metadata';

import path from 'node:path';
import fs from 'node:fs';

import { Umzug } from 'umzug';
import { container } from 'tsyringe';

import { DEP_CONFIG_ENV } from '@/constants/dependencies.enum';

import { type GenericPool } from '@/domain/repositories/DataAccess';
import { type ConfigService } from '@/application/ports/ConfigServide';

import '@/infrastructure/environment/dotenv.config';
import '@/infrastructure/database/psql/PsqlDataAccess';
import '@/infrastructure/database/mysql/MysqlDataAccess';

import { getContext, getStorage } from './lib/config.util';
import { run } from './lib/client.util';

const envConfig = container.resolve<ConfigService>(DEP_CONFIG_ENV);

async function start() {
  // #region Get context from the container
  const context = getContext();
  // #endregion

  // #region Get template typescript script // from file as string
  const templateFilename = path.join(process.cwd(), envConfig.MIGRATE_TEMPLATE);
  const templateText = fs.readFileSync(templateFilename, 'utf-8');
  // #endregion

  // #region Get Create Migration
  const migrationFolder = path.join(process.cwd(), envConfig.MIGRATE_FOLDER);
  // #endregion

  // #region Get Storage
  const storage = getStorage();
  // #endregion

  const umzug = new Umzug<GenericPool>({
    migrations: {
      glob: path.join(migrationFolder, '*.*.*T*.*.*.*.ts'),
    },
    context,
    storage,
    create: {
      folder: migrationFolder,
      template: (filePath: string) => [[filePath, templateText]],
    },
    logger: console,
  });

  await run({ context, umzug });
}

start();
