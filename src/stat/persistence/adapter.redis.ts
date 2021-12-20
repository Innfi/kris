import { createClient } from 'redis';
import dotenv from 'dotenv';

import { StockData, TimestampTypeEnum, ReadStockDataResult } from 'stat/model';

dotenv.config();
const redisUrl = process.env.REDIS_URL;

export const adapterRedis = createClient({ url: redisUrl });

adapterRedis.on('connect', () => {
  console.log('redis connected');
});

adapterRedis.on('end', () => {
  console.log('redis disconnected');
});

adapterRedis.on('reconnecting', () => {
  console.log('redis reconnecting');
});

const toStockKey = (
  type: TimestampTypeEnum,
  symbol: string,
  interval: string,
): string => `${type.toString()}:${symbol}:${interval}`;

// getStockData
export const getStockData = async (
  type: TimestampTypeEnum,
  symbol: string,
  interval: string,
): Promise<ReadStockDataResult> => {
  const key = toStockKey(type, symbol, interval);

  const rawData = await adapterRedis.get(key);
  if (typeof rawData !== 'string') return { err: 'invalid data' };

  try {
    return {
      err: 'ok',
      stockData: JSON.parse(rawData) as StockData,
    };
  } catch (err: any) {
    console.log(`getStockData error: ${err}`);
    return {
      err: 'parse json failed'
    }
  }
}

export const setStockData = async (
  type: TimestampTypeEnum,
  symbol: string,
  interval: string,
  stockData: StockData,
) => {
  const key = toStockKey(type, symbol, interval);
  
  try {
    await adapterRedis.set(key, JSON.stringify(stockData));
  } catch (err: any) {
    console.log(`setSeockData error: ${err}`);
    return { err: 'write failed' };
  }

  return { err: 'ok' };
}
