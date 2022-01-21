export enum TimestampTypeEnum {
  INTRADAY = 1,
  DAILY = 3,
}

export interface Snapshot {
  time: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SnapshotMinimal {
  x: Date;
  y: number[];
}

export interface StockData {
  symbol: string;
  interval: string;
  timestampType: TimestampTypeEnum;
  snapshots?: Snapshot[];
  snapshotMins?: SnapshotMinimal[];
}

export interface ReadStockDataInput {
  type: TimestampTypeEnum;
  symbol: string;
  interval: string;
}

export interface ReadStockDataResult {
  err: string;
  stockData?: StockData;
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
