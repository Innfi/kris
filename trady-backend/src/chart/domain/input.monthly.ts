import { TimeSeriesType } from 'chart/model';
import { LoadChartInputBase } from './input.base';

export class LoadChartInputMonthly implements LoadChartInputBase {
  timeSeriesType: Readonly<TimeSeriesType> = 'TIME_SERIES_MONTHLY';

  timeSeriesKey: Readonly<string> = 'Monthly Time Series';

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
