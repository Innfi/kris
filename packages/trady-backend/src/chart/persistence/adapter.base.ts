import LoadChartInputBase from 'chart/domain/input.base';
import {
  ChartData,
  LoadChartDataResult,
  SaveChartDataResult,
} from 'chart/model';

interface AdapterBase {
  readChartData(
    key: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>>;

  writeChartData(chartData: Readonly<ChartData>): Promise<SaveChartDataResult>;
}

export default AdapterBase;
