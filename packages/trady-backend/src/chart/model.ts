export enum TimestampTypeEnum {
  INTRADAY = 1,
  DAILY = 3,
  WEEKLY = 7,
  MONTHLY = 11,
}

export type TimestampType = 'Intraday' | 'Daily' | 'Weekly' | 'Monthly';

export interface SnapshotUnit {
  x: Date;
  y: number[];
}

export interface StockData {
  symbol: string;
  interval?: string;
  timestampType: TimestampTypeEnum;
  snapshots?: SnapshotUnit[];
}

export interface ReadStockDataInput {
  type: TimestampTypeEnum;
  symbol: string;
  interval: string;
}

export interface ReadStockDataResult {
  err: string;
  snapshots?: SnapshotUnit[];
}

export interface WriteStockDataInput {
  type: TimestampTypeEnum;
  symbol: string;
  interval: string;
  stockData: StockData;
}

export interface WriteStockDataResult {
  err: string;
}

export interface LoadPortfolioStatsResult {
  err: string;
  stockDataByPorts?: StockData[];
}
