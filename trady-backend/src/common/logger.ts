import { Service } from 'typedi';
import winston from 'winston';
import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';
import dotenv from 'dotenv';

dotenv.config();
const esUrl = process.env.ES_URL;

@Service()
class TradyLogger {
  protected esTransportOptions: ElasticsearchTransportOptions = {
    level: 'info',
    clientOpts: { node: esUrl },
  };

  protected esTransport = new ElasticsearchTransport(this.esTransportOptions);

  protected logger: Readonly<winston.Logger> = winston.createLogger({
    transports: [this.esTransport],
  });

  constructor() {
    this.logger.info('TradyLogger] ');

    if (process.env.NODE_ENV !== 'local') return;

    this.logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }

  info(msg: unknown) {
    this.logger.info(msg);
  }

  debug(msg: unknown) {
    this.logger.info(msg);
  }

  error(msg: unknown) {
    this.logger.error(msg);
  }
}

export default TradyLogger;
