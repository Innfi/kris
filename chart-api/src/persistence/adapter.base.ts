import { LoadChartInputBase } from '../chart-input/input.base';
import { ChartData, LoadChartDataResult, SaveChartDataResult } from '../model';

export interface AdapterBase {
  readChartData(
    key: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>>;

  writeChartData(chartData: Readonly<ChartData>): Promise<SaveChartDataResult>;
}
