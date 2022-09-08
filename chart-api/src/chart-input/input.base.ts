export interface LoadChartInputBase {
  toDescriptor(): Readonly<string>;
  toReferenceUrl(
    prefix: Readonly<string>,
    apiKey: Readonly<string>,
  ): Readonly<string>;
  toTimeSeriesKey(): Readonly<string>;
}
