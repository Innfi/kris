import { Service } from 'typedi';
import { createClient } from 'redis';
import dotenv from 'dotenv';

import {
  StockData,
  TimestampTypeEnum,
  ReadStockDataResult,
  WriteStockDataResult,
  ReadStockDataInput,
  WriteStockDataInput,
} from 'chart/model';
import TradyLogger from '../../common/logger';
import AdapterBase from './adapter.base';

dotenv.config();
const redisUrl = process.env.REDIS_URL;

const toStockKey = (
  type: TimestampTypeEnum,
  symbol: string,
  interval: string,
): string => `${type.toString()}:${symbol}:${interval}`;

const toSeconds = (interval: string): number => {
  const min = interval.replace('min', '');

  return Number.parseInt(min, 10) * 60;
};

@Service()
class AdapterRedis implements AdapterBase {
  protected readonly client = createClient({ url: redisUrl });

  protected connected: boolean = false;

  constructor(protected logger: TradyLogger) {
    this.initEvents();
  }

  protected initEvents() {
    this.client.on('connect', () => {
      this.logger.info('connected');
      this.connected = true;
    });
    this.client.on('reconnecting', () => {
      this.logger.info('reconnecting');
      this.connected = false;
    });
    this.client.on('end', () => {
      this.logger.info('connection closed');
      this.connected = false;
    });
  }

  // readStockData
  async readStockData(input: ReadStockDataInput): Promise<ReadStockDataResult> {
    try {
      const { type, symbol, interval } = input;

      if (!this.connected) {
        this.logger.info(`AdapterRedis.readStockData] calling connect`);
        await this.client.connect();
      }

      const key = toStockKey(type, symbol, interval);

      const rawData = await this.client.get(key);
      if (typeof rawData !== 'string') return { err: 'invalid data' };

      return {
        err: 'ok',
        stockData: JSON.parse(rawData) as StockData,
      };
    } catch (err: unknown) {
      this.logger.info(`AdapterRedis.readStockData] ${(err as Error).stack}`);
      return {
        err: 'parse json failed',
      };
    }
  }

  // writeStockData
  async writeStockData(
    input: WriteStockDataInput,
  ): Promise<WriteStockDataResult> {
    try {
      const { type, symbol, interval, stockData } = input;

      if (!this.connected) {
        this.logger.info(`AdapterRedis.writeStockData] calling connect`);
        await this.client.connect();
      }

      const key = toStockKey(type, symbol, interval);

      const expireTime = toSeconds(interval);
      if (!expireTime) return { err: 'invalid interval' };

      await this.client.setEx(key, expireTime, JSON.stringify(stockData));
    } catch (err: unknown) {
      this.logger.info(`AdapterRedis.writeStockData] ${(err as Error).stack}`);
      return { err: 'write failed' };
    }

    return { err: 'ok' };
  }
}

export default AdapterRedis;
