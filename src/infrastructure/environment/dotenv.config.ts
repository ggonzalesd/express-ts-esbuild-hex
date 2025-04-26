import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

import type { ConfigService } from '@@app/ports/ConfigService.port';

const filesnames = {
  development: '.env',
  production: '.env.production',
  test: '.env.test',
} as const;

const filename =
  filesnames[process.env.NODE_ENV as keyof typeof filesnames] ||
  filesnames.development;

const result = dotenv.config({
  path: path.join(process.cwd(), filename),
});

if (result.error) {
  throw new Error(
    `Failed to load environment variables from ${filename}: ${result.error.message}`,
  );
}

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),

    PROTOCOL: z.enum(['http', 'https']).default('http'),
    HOST: z.string().default('localhost'),
    PORT: z.string().regex(/^\d+$/).default('3000').transform(Number),

    API_PREFIX: z.string().default('api'),
    API_VERSION: z.string().default('v1'),

    JWT_SECRET: z.string().default('your_jwt_secret'),
    JWT_EXPIRES_IN: z.string().default('1h'),

    BCRYPT_SALT: z.string().regex(/^\d+$/).default('10').transform(Number),

    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().regex(/^\d+$/).default('5432').transform(Number),
    DB_USER: z.string().default('postgres'),
    DB_PASS: z.string().default('postgres'),
    DB_NAME: z.string().default('postgres'),
    DB_DIALECT: z.enum(['postgres', 'mysql', 'sqlite']).default('postgres'),
    DB_CONNECTION_POOL_MAX: z
      .string()
      .regex(/^\d+$/)
      .default('4')
      .transform(Number),

    MIGRATE_TEMPLATE: z.string().default('template.ts'),
    MIGRATE_FOLDER: z.string().default('migrations'),

    LOGGER_FILE: z.string().default('~/logs.log'),
  })
  .transform((env) => {
    const API_BASE = [env.API_PREFIX, env.API_VERSION]
      .filter(Boolean)
      .join('/');
    return {
      API_BASE: API_BASE ? `/${API_BASE}` : '',
      DB_URI: `${env.DB_DIALECT}://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
      API_URL: `${env.PROTOCOL}://${env.HOST}:${env.PORT}/${[env.API_PREFIX, env.API_VERSION].filter(Boolean).join('/')}`,
      IS_PRODUCTION: env.NODE_ENV === 'production',
      IS_DEVELOPMENT: env.NODE_ENV === 'development',
      ...env,
    };
  });

export const dotenvConfigFactory: () => ConfigService = () =>
  envSchema.parse(process.env);
