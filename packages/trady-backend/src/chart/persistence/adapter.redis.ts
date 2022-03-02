import { Service } from 'typedi';
import { createClient } from 'redis';
import dotenv from 'dotenv';

import TradyLogger from '../../common/logger';
import AdapterBase from './adapter.base';
import LoadChartInputBase from 'chart/domain/input.base';
import {
  LoadChartDataResult,
  TimeSeriesUnit,
  SaveChartDataResult,
} from 'chart/model';

dotenv.config();
const redisUrl = process.env.REDIS_URL;

@Service()
class AdapterRedis implements AdapterBase {
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
  async readChartData(
    key: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>> {
    return { err: 'ok' };
  }

  // writeChartData
  async writeChartData(
    key: Readonly<LoadChartInputBase>,
    timeSeries: Readonly<TimeSeriesUnit>[],
  ): Promise<SaveChartDataResult> {
    return { err: 'ok' };
  }
}

export default AdapterRedis;
