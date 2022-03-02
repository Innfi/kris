import LoadChartInputBase from 'chart/domain/input.base';
import {
  LoadChartDataResult,
  SaveChartDataResult,
  TimeSeriesUnit,
} from 'chart/model';

interface AdapterBase {
  readChartData(
    key: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>>;

  writeChartData(
    key: Readonly<LoadChartInputBase>,
    timeSeries: Readonly<TimeSeriesUnit>[],
  ): Promise<SaveChartDataResult>;
}

export default AdapterBase;
