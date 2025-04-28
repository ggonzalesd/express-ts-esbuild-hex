import { container } from 'tsyringe';

import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

import { DepEnvironment } from '@@const/dependencies.enum';

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

    DB_USER: z.string().default('user'),
    DB_PASS: z.string().default('password'),
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().regex(/^\d+$/).default('5432').transform(Number),
    DB_NAME: z.string().default('database'),
    DB_DIALECT: z.enum(['postgres', 'mysql', 'sqlite']).default('postgres'),
    DB_CONNECTION_POOL_MAX: z
      .string()
      .regex(/^\d+$/)
      .default('4')
      .transform(Number),

    SMTP_HOST: z.string().default('localhost'),
    SMTP_PORT: z.string().regex(/^\d+$/).default('1025').transform(Number),
    SMTP_USER: z.string().default(''),
    SMTP_PASS: z.string().default(''),
    SMTP_SECURE: z.enum(['tls', 'ssl', 'false']).default('false'),

    EMAIL_FROM: z.string(),
    EMAIL_FOLDER: z.string().default('emails'),

    MIGRATE_TEMPLATE: z.string().default('template.ts'),
    MIGRATE_FOLDER: z.string().default('migrations'),

    LOGGER_FILE: z.string().default('~/logs.log'),

    EVENT_CONNECTION: z.string().default('redis://localhost:6379'),
    EVENT_PASSWORD: z.string().default('your_redis_password'),

    STATIC_DIR: z.string().default('public'),
  })
  .transform((env) => {
    const API_BASE = [env.API_PREFIX, env.API_VERSION]
      .filter(Boolean)
      .join('/');
    return {
      API_BASE: API_BASE ? `/${API_BASE}` : '',
      API_URL: `${env.PROTOCOL}://${env.HOST}:${env.PORT}/${[env.API_PREFIX, env.API_VERSION].filter(Boolean).join('/')}`,
      DB_CONNECTION_STRING: `${env.DB_DIALECT}://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
      IS_PRODUCTION: env.NODE_ENV === 'production',
      IS_DEVELOPMENT: env.NODE_ENV === 'development',
      ...env,
    };
  });

container.register<ConfigService>(DepEnvironment.DOTENV, {
  useValue: envSchema.parse(process.env),
});
