import { TimeSeriesType } from 'chart/model';
import { LoadChartInputBase } from './input.base';

export class LoadChartInputIntraday implements LoadChartInputBase {
  timeSeriesType: Readonly<TimeSeriesType> = 'TIME_SERIES_INTRADAY';

  symbol: Readonly<string>;

  interval: Readonly<string>;

  constructor(symbol: string, interval: string) {
    this.symbol = symbol;
    this.interval = interval;
  }

  toDescriptor(): Readonly<string> {
    return `${this.symbol}.${this.timeSeriesType}.${this.interval}`;
  }

  toReferenceUrl(
    prefix: Readonly<String>,
    apiKey: Readonly<string>,
  ): Readonly<string> {
    return (
      `${prefix}` +
      `?function=${this.timeSeriesType}` +
      `&symbol=${this.symbol}` +
      `&interval=${this.interval}` +
      `&apikey=${apiKey}`
    );
  }

  toTimeSeriesKey(): Readonly<string> {
    return `Time Series (${this.interval})`;
  }
}
