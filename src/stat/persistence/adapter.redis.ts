import { Service } from 'typedi';
import { createClient } from 'redis';
import dotenv from 'dotenv';

import { StockData, TimestampTypeEnum } from 'stat/model';

dotenv.config();
const redisUrl = process.env.REDIS_URL;

const client = createClient({ url: redisUrl });
type RedisClientType = typeof client;

const toStockKey = (
  type: TimestampTypeEnum,
  symbol: string,
  interval: string,
): string => {
  return `${type.toString()}:${symbol}:${interval}`;
}

@Service()
class AdapterRedis {
  async init() {
    this.initEvent(client);

    await client.connect();
  }

  protected initEvent(client: RedisClientType) {
    client.on('connect', () => {
      console.log('redis connected');
    });

    client.on('end', () => {
      console.log('redis disconnected');
    });

    client.on('reconnecting', () => {
      console.log('redis reconnecting');
    });
  }

  //setStockData 
  setStockData(type: TimestampTypeEnum, symbol: string, interval: string, 
    stockData: StockData) {
    const key = toStockKey(type, symbol, interval);
    client.set(key, JSON.stringify(stockData));
  }

  //getStockData
  getStockData(type: TimestampTypeEnum, symbol: string, interval: string): string {
    const key = toStockKey(type, symbol, interval);

    const rawData = client.get(key);
    if(typeof rawData === 'string') return rawData;

    return '';
  }
}

export default AdapterRedis;
