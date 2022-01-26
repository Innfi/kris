import { Service } from 'typedi';
import winston from 'winston';
import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

@Service()
class TradyLogger {
  protected esTransportOptions: ElasticsearchTransportOptions = {
    level: 'info',
    clientOpts: { node: process.env.ES_URL },
  };

  protected esTransport = new ElasticsearchTransport(this.esTransportOptions);

  protected logger: Readonly<winston.Logger> = winston.createLogger({
    transports: [this.esTransport],
  });

  constructor() {
    console.log('---TradyLogger---');
    this.logger.info('TradyLogger] ');
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
