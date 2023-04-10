import express from 'express';
import errorHandler from './lib/middleware/error-handler';
import requestsLogger from './lib/middleware/requests-logger';
import router from './router';
import repository from './db';

import { collectDefaultMetrics, register, Counter, Histogram } from 'prom-client';

import 'dotenv/config';

const bootstrap = async () => {
  const app = express();

  // Probe every second.
  collectDefaultMetrics({ timeout: 1000 });

  await repository.migrate();
  await repository.seed();

  app.use(express.json());
  app.use(requestsLogger);
  app.use(errorHandler());

  app.use('/v1', router);

  app.get('/healthcheck', async (_, res) => {
    return res.status(200).json({ running: 'true' });
  });

  const counter = new Counter({
    name: 'node_request_operations_total',
    help: 'The total number of processed requests'
  });
  
  const histogram = new Histogram({
    name: 'node_request_duration_seconds',
    help: 'Histogram for the duration in seconds.',
    buckets: [1, 2, 5, 6, 10]
  });

  app.get('/metrics', async (_, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  });

  return Promise.resolve(app);
}

export default bootstrap;
