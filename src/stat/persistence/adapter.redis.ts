import { Service } from 'typedi';
import { createClient } from 'redis';
import dotenv from 'dotenv';

import { StockData, TimestampTypeEnum } from 'stat/model';

dotenv.config();
const redisUrl = process.env.REDIS_URL;

@Service()
class AdapterRedis {
  protected client: any = undefined;

  constructor() {}

  //setStockData
  async setStockData(
    type: TimestampTypeEnum,
    symbol: string,
    interval: string,
    stockData: StockData,
  ): Promise<void> {
    this.ensureConnected();

    const key = this.toStockKey(type, symbol, interval);
    this.client.set(key, JSON.stringify(stockData));
  }

  protected async ensureConnected(): Promise<void> {
    if (this.client) return;

    this.client = createClient({ url: redisUrl });

    this.client.on('error', (err: Error) => {
      console.log(`error: ${err}`);
    });

    this.client.on('connected');

    await this.client.connect();
    console.log('ensureConnected');
  }

  protected toStockKey(
    type: TimestampTypeEnum,
    symbol: string,
    interval: string,
  ): string {
    return `${type.toString()}:${symbol}:${interval}`;
  }
}

export default AdapterRedis;
