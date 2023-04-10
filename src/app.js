import express from 'express';
import errorHandler from './lib/middleware/error-handler';
import requestsLogger from './lib/middleware/requests-logger';
import router from './router';
import repository from './db';

import 'dotenv/config';

const bootstrap = async () => {
  const app = express();

  await repository.migrate();
  await repository.seed();

  app.use(express.json());
  app.use(requestsLogger);
  app.use(errorHandler());

  app.use('/v1', router);

  app.get('/healthcheck', async (_, res) => {
    return res.status(200).json({ running: 'true' });
  });

  return Promise.resolve(app);
}

export default bootstrap;
