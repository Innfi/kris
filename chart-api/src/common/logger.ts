import { Service } from 'typedi';
import winston from 'winston';
import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';
import dotenv from 'dotenv';

dotenv.config();
const esUrl = process.env.ES_URL ? process.env.ES_URL : 'http://localhost:9200';

@Service()
export class TradyLogger {
  readonly logPrefix = 'chart-api';

  protected esTransportOptions: ElasticsearchTransportOptions = {
    level: 'info',
    clientOpts: { node: esUrl },
  };

  protected esTransport = new ElasticsearchTransport(this.esTransportOptions);

  protected logger: Readonly<winston.Logger> = winston.createLogger({
    transports: [
      this.esTransport,
      new winston.transports.Console({
        handleExceptions: true,
      })
    ],
  });

  constructor() {
    this.logger.info('chart-api: logger init');
  }

  info(msg: string, actor?: string) {
    this.logger.info({
      message: `${this.logPrefix}] ${msg}`,
      meta: {
        app: this.logPrefix,
        actor,
      }
    });
  }

  debug(msg: string, actor?: string) {
    this.logger.debug({
      message: `${this.logPrefix}] ${msg}`,
      meta: {
        app: this.logPrefix,
        actor,
      }
    });
  }

  error(msg: string, actor?: string) {
    this.logger.error({
      message: `${this.logPrefix}] ${msg}`,
      meta: {
        app: this.logPrefix,
        actor,
      }
    });
  }
}
