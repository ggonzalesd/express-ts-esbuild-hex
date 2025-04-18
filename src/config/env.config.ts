import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: parseInt(process.env.PORT ?? '3000'),
  HOST: process.env.HOST ?? 'localhost',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  API_PREFIX: process.env.API_PREFIX ?? '/api',
  API_VERSION: process.env.API_VERSION ?? 'v1',
  API_URL: `${process.env.API_PREFIX ?? '/api'}/${process.env.API_VERSION ?? 'v1'}`,
};
