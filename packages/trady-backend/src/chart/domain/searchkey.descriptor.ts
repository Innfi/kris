import dotenv from 'dotenv';

import { TimestampType } from '../model';

dotenv.config();

const referenceUrl = process.env.URL;
const apiKey = process.env.API_KEY;

export interface SearchKeyUnit {
  timestampType: TimestampType;
  keyName: string;
}

export type SearchKeyDict = {
  [timestampType in TimestampType]: SearchKeyUnit;
};

export const toIntradayUrl = (
  type: string,
  symbol: string,
  interval: string,
): string =>
  `${referenceUrl}` +
  `?function=${type}` +
  `&symbol=${symbol}` +
  `&interval=${interval}` +
  `&apikey=${apiKey}`;

export const toDailyUrl = (type: string, symbol: string): string =>
  `${referenceUrl}` +
  `?function=${type}` +
  `&symbol=${symbol}` +
  `&apikey=${apiKey}`;
