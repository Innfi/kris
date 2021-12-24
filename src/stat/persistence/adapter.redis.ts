import { Service } from 'typedi';
import { createClient } from 'redis';
import dotenv from 'dotenv';

import {
  StockData,
  TimestampTypeEnum,
  ReadStockDataResult,
  WriteStockDataResult,
} from 'stat/model';

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
class AdapterRedis {
  protected readonly client = createClient({ url: redisUrl });

  protected connected: boolean = false;

  constructor() {
    this.initEvents();
  }

  protected initEvents() {
    this.client.on('connect', () => {
      console.log('connected');
      this.connected = true;
    });
    this.client.on('reconnecting', () => {
      console.log('reconnecting');
      this.connected = false;
    });
    this.client.on('end', () => {
      console.log('connection closed');
      this.connected = false;
    });
  }

  // getStockData
  async getStockData(
    type: TimestampTypeEnum,
    symbol: string,
    interval: string,
  ): Promise<ReadStockDataResult> {
    if (!this.connected) {
      console.log('calling connect');
      await this.client.connect();
    }

    const key = toStockKey(type, symbol, interval);

    const rawData = await this.client.get(key);
    if (typeof rawData !== 'string') return { err: 'invalid data' };

    try {
      return {
        err: 'ok',
        stockData: JSON.parse(rawData) as StockData,
      };
    } catch (err: any) {
      console.log(`getStockData error: ${err}`);
      return {
        err: 'parse json failed',
      };
    }
  }

  async setStockData(
    type: TimestampTypeEnum,
    symbol: string,
    interval: string,
    stockData: StockData,
  ): Promise<WriteStockDataResult> {
    if (!this.connected) {
      console.log('calling connect');
      await this.client.connect();
    }

    const key = toStockKey(type, symbol, interval);

    try {
      const expireTime = toSeconds(interval);
      if (!expireTime) return { err: 'invalid interval' };

      await this.client.setEx(key, expireTime, JSON.stringify(stockData));
    } catch (err: any) {
      console.log(`setSeockData error: ${err}`);
      return { err: 'write failed' };
    }

    return { err: 'ok' };
  }
}

export default AdapterRedis;
