import { Service } from 'typedi';
import { createClient } from 'redis';
import dotenv from 'dotenv';

import { TradyLogger } from '../common/logger';
import { LoadChartDataResult, TimeSeriesUnit } from '../model/model';

dotenv.config();
const redisUrl = process.env.REDIS_URL
  ? process.env.REDIS_URL
  : 'redis://127.0.0.1:6379';

@Service()
export class AdapterRedis {
  protected readonly client = createClient({ url: redisUrl });

  protected connected: boolean = false;

  constructor(protected logger: TradyLogger) {
    this.initEvents();
  }

  protected initEvents() {
    this.client.on('connect', () => {
      this.logger.info('AdapterRedis] connected');
      this.connected = true;
    });
    this.client.on('reconnecting', () => {
      this.logger.info('AdapterRedis] reconnecting');
      this.connected = false;
    });
    this.client.on('end', () => {
      this.logger.info('AdapterRedis] connection closed');
      this.connected = false;
    });
  }

  // readChartData
  async readChartData(key: string): Promise<Readonly<LoadChartDataResult>> {
    try {
      if (!this.connected) {
        this.logger.info('AdapterRedis.readChartData] calling connect');
        await this.client.connect();
      }

      const rawData = await this.client.get(key);
      if (typeof rawData !== 'string') return { err: 'not exist' };

      const timeSeries = JSON.parse(rawData) as TimeSeriesUnit[];

      return {
        err: 'ok',
        chartData: {
          descriptor: key,
          timeSeries,
        },
      };
    } catch (err: unknown) {
      this.logger.info(`AdapterRedis.readChartData] ${(err as Error).stack}`);
      return { err: 'read failed' };
    }
  }
}
