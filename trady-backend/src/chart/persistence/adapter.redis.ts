import { Service } from 'typedi';
import { createClient } from 'redis';
import dotenv from 'dotenv';

import { LoadChartInputBase } from 'chart/domain/input.base';
import {
  ChartData,
  LoadChartDataResult,
  SaveChartDataResult,
  TimeSeriesUnit,
} from 'chart/model';
import TradyLogger from '../../common/logger';
import AdapterBase from './adapter.base';

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
    try {
      if (!this.connected) {
        this.logger.info(`AdapterRedis.readChartData] calling connect`);
        await this.client.connect();
      }

      const descriptor = key.toDescriptor();
      const rawData = await this.client.get(descriptor);
      if (typeof rawData !== 'string') return { err: 'read failed' };

      const timeSeries = JSON.parse(rawData) as TimeSeriesUnit[];

      return {
        err: 'ok',
        chartData: {
          descriptor,
          timeSeries,
        },
      };
    } catch (err: unknown) {
      this.logger.info(`AdapterRedis.readChartData] ${(err as Error).stack}`);
      return { err: 'read failed' };
    }
  }

  // writeChartData
  async writeChartData(
    chartData: Readonly<ChartData>,
  ): Promise<SaveChartDataResult> {
    try {
      if (!this.connected) {
        this.logger.info(`AdapterRedis.writeChartData] calling connect`);
        await this.client.connect();
      }

      const descriptor = chartData.descriptor as string;
      await this.client.setEx(
        descriptor,
        60,
        JSON.stringify(chartData.timeSeries),
      );
    } catch (err: unknown) {
      this.logger.info(`AdapterRedis.writeChartData] ${(err as Error).stack}`);
      return { err: 'write failed' };
    }

    return { err: 'ok' };
  }
}

export default AdapterRedis;
