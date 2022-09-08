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
  | 'read failed'
  | 'fetch requested'
  | 'send event failed';
export type ChartType = 
  | 'intraday'
  | 'daily'
  | 'weekly'
  | 'monthly';

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

export interface ChartRequestInput {
  chartType: ChartType;
  symbol: string;
  interval?: string;
}