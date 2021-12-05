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

export interface StockData {
  symbol: string;
  interval: string;
  timestampType: TimestampTypeEnum;
  snapshots: Snapshot[];
}

export interface ReadIntradayResult {
  err: string;
  stockData?: StockData;
}

export interface WriteIntradayResult {
  err: string;
}
