export interface ConfigService {
  NODE_ENV: 'development' | 'production' | 'test';

  PROTOCOL: 'http' | 'https';
  HOST: string;
  PORT: number;

  API_PREFIX: string;
  API_VERSION: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  BCRYPT_SALT: number;

  DB_CONNECTION_STRING: string;
  DB_DIALECT: 'postgres' | 'mysql' | 'sqlite';
  DB_CONNECTION_POOL_MAX: number;

  MIGRATE_TEMPLATE: string;
  MIGRATE_FOLDER: string;

  API_BASE: string;
  API_URL: string;
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;

  LOGGER_FILE: string;

  EVENT_CONNECTION: string;
}
