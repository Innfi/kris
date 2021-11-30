export enum TimestampTypeEnum {
  INTRADAY = 1,
  DAILY = 3,
};

export interface SpotDetail {
  [milestone: string]: string;
}

export interface Spot {
  [timestamp: string]: SpotDetail;
}

export interface Snapshot {
  time: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export interface StockData {
  symbol: string;
  timestampType: TimestampTypeEnum;
  snapshots: Snapshot[];
};