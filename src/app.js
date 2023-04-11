import express from 'express';
import errorHandler from './lib/middleware/error-handler';
import requestsLogger from './lib/middleware/requests-logger';
import router from './router';
import repository from './db';
import {
  collectDefaultMetrics,
  register,
  Counter,
  Histogram,
} from 'prom-client';

import 'dotenv/config';

const bootstrap = async () => {
  const app = express();

  const createDelayHandler = async (_, res) => {
    if ((Math.floor(Math.random() * 100)) === 0) {
      throw new Error('Internal Error')
    }
    // Generate number between 3-6, then delay by a factor of 1000 (miliseconds)
    const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3
    await new Promise(res => setTimeout(res, delaySeconds * 1000))
    res.end('Slow url accessed!');
  };

  collectDefaultMetrics({
    app: 'node-application-api',
    prefix: 'node_',
    timeout: 1000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register,
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

  const httpRequestTimer = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
  });

  register.registerMetric(httpRequestTimer);

  await repository.migrate();
  await repository.seed();

  app.use(express.json());
  app.use(requestsLogger);
  app.use(errorHandler());

  app.use('/v1', router);

  app.get('/healthcheck', async (_, res) => {
    return res.status(200).json({ running: 'true' });
  });

  app.get('/slow', async (req, res) => {
    const end = httpRequestTimer.startTimer();
    const route = req.route.path;

    try {
      await createDelayHandler(req, res);
    } catch (error) {
      end({ route, code: res.statusCode, error });
    }

    end({ route, code: res.statusCode, method: req.method });
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
