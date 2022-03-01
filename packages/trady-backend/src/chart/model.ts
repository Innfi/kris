export type TimeSeriesType = 'TIME_SERIES_INTRADAY' | 'TIME_SERIES_DAILY';
export type ChartError =
  | 'ok'
  | 'server error'
  | 'parse failed'
  | 'data unavailable';

export interface TimeSeriesUnit {
  x: Date;
  y: number[];
}

export interface ChartData {
  err: ChartError;
  descriptor?: string;
  timeseries?: Readonly<TimeSeriesUnit>[];
}

export interface LoadChartDataResult {
  err: ChartError;
  chartData?: ChartData;
}

export interface ParseStockDataResult {
  err: ChartError;
  timeSeries?: Readonly<TimeSeriesUnit>[];
}
