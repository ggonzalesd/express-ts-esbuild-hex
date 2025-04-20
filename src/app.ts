import { container } from 'tsyringe';
import express from 'express';

import { DEP_CONFIG_ENV } from '@/constants/dependencies.enum';
import { type ConfigService } from '@/application/ports/ConfigServide';

const envConfig = container.resolve<ConfigService>(DEP_CONFIG_ENV);

const { API_BASE, NODE_ENV } = envConfig;

// eslint-disable-next-line no-console
console.log({ NODE_ENV });

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`${API_BASE}/health`, (req, res) => {
  res.status(200).json({ status: 'UP' });
});
