interface LoadChartInputBase {
  toDescriptor(): Readonly<string>;
  toReferenceUrl(
    prefix: Readonly<String>,
    apiKey: Readonly<string>,
  ): Readonly<string>;
}

export default LoadChartInputBase;
