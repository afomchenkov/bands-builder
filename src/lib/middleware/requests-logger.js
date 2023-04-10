import logger from '../../logger';

const requestsLogger = (req, res, next) => {
  logger.info(`HTTP:request [${req.method.toUpperCase()} - ${req.url}}]`);
  next();
};

export default requestsLogger;
