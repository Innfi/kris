export type TimeSeriesType =
  | 'TIME_SERIES_INTRADAY'
  | 'TIME_SERIES_DAILY'
  | 'TIME_SERIES_WEEKLY'
  | 'TIME_SERIES_MONTHLY';
export type ChartError =
  | 'ok'
  | 'server error'
  | 'parse failed'
  | 'data unavailable'
  | 'write failed'
  | 'read failed';

export interface TimeSeriesUnit {
  x: Date;
  y: number[];
}

export interface ChartData {
  descriptor?: string;
  timeSeries?: Readonly<TimeSeriesUnit>[];
}

export interface LoadChartDataResult {
  err: ChartError;
  chartData?: ChartData;
}

export interface SaveChartDataResult {
  err: ChartError;
}

export interface ParseStockDataResult {
  err: ChartError;
  timeSeries?: Readonly<TimeSeriesUnit>[];
}
