export interface ConfigService {
  NODE_ENV: 'development' | 'production' | 'test';

  PROTOCOL: 'http' | 'https';
  HOST: string;
  PORT: number;

  API_URL: string;

  API_PREFIX: string;
  API_VERSION: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  BCRYPT_SALT: number;

  DB_USER: string;
  DB_PASS: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_CONNECTION_STRING: string;
  DB_DIALECT: 'postgres' | 'mysql' | 'sqlite';
  DB_CONNECTION_POOL_MAX: number;

  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_SECURE: 'tls' | 'ssl' | 'false';

  EMAIL_FROM: string;
  EMAIL_FOLDER: string;

  MIGRATE_TEMPLATE: string;
  MIGRATE_FOLDER: string;

  API_BASE: string;
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;

  LOGGER_FILE: string;

  EVENT_CONNECTION: string;
  EVENT_PASSWORD: string;

  STATIC_DIR: string;
}
