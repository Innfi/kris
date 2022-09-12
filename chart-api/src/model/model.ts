export type ChartError =
  | 'ok'
  | 'server error'
  | 'not exist'
  | 'read failed'
  | 'fetch requested'
  | 'send event failed';
export type ChartType = 'intraday' | 'daily' | 'weekly' | 'monthly';

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

export interface ChartRequestInput {
  chartType: ChartType;
  symbol: string;
  interval?: string;
}
