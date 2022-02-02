// export enum TimestampTypeEnum {
//   INTRADAY = 1,
//   DAILY = 3,
// }

export interface SnapshotMinimal {
  x: Date;
  y: number[];
}

export interface StockData {
  symbol: string;
  interval: string;
  //timestampType: TimestampTypeEnum;
  snapshotMins?: SnapshotMinimal[];
}
