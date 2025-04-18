import express from 'express';

import envConfig from '@/config/env.config';

const { API_URL } = envConfig;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`${API_URL}/health`, (req, res) => {
  res.status(200).json({ status: 'UP' });
});
