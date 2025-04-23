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

  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  DB_DIALECT: 'postgres' | 'mysql' | 'sqlite';
  DB_CONNECTION_POOL_MAX: number;

  MIGRATE_TEMPLATE: string;
  MIGRATE_FOLDER: string;

  API_BASE: string;
  DB_URI: string;
  API_URL: string;
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
}
