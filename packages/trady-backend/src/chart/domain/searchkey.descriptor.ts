import dotenv from 'dotenv';

import { TimeSeriesType, TimestampType, TimestampTypeEnum } from '../model';

dotenv.config();

const referenceUrl = process.env.URL;
const apiKey = process.env.API_KEY;

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


export interface SearchKeyUnit {
  timestampType: TimestampType;
  keyName: TimeSeriesType;
  toUrl: Function;
}

export type SearchKeyDict = {
  [timestampType in TimestampType]: SearchKeyUnit;
};

export const searchKeyDict: SearchKeyDict = {
  'Intraday': {
    timestampType: 'Intraday',
    keyName: 'TIME_SERIES_INTRADAY',
    toUrl: toIntradayUrl,
  },
  'Daily': {
    timestampType: 'Daily',
    keyName: 'TIME_SERIES_DAILY',
    toUrl: toDailyUrl,
  },
};
