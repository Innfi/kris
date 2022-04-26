import { TimeSeriesType } from 'chart/model';
import { LoadChartInputBase } from './input.base';

export class LoadChartInputDaily implements LoadChartInputBase {
  timeSeriesType: Readonly<TimeSeriesType> = 'TIME_SERIES_DAILY';

  timeSeriesKey: Readonly<string> = 'Time Series (Daily)';

  symbol: Readonly<string>;

  constructor(symbol: string) {
    this.symbol = symbol;
  }

  toDescriptor(): Readonly<string> {
    return `${this.symbol}.${this.timeSeriesType}`;
  }

  toReferenceUrl(
    prefix: Readonly<String>,
    apiKey: Readonly<string>,
  ): Readonly<string> {
    return (
      `${prefix}` +
      `?function=${this.timeSeriesType}` +
      `&symbol=${this.symbol}` +
      `&apikey=${apiKey}`
    );
  }

  toTimeSeriesKey(): Readonly<string> {
    return this.timeSeriesKey;
  }
}
