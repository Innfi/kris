import { Service } from 'typedi';

import LoadChartInputBase from 'chart/domain/input.base';
import {
  LoadChartDataResult,
  TimeSeriesUnit,
  SaveChartDataResult,
} from 'chart/model';
import AdapterBase from './adapter.base';

@Service()
class AdapterFile implements AdapterBase {
  // readChartData
  async readChartData(
    key: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>> {
    return { err: 'ok' };
  }

  // writeChartData
  async writeChartData(
    key: Readonly<LoadChartInputBase>,
    timeSeries: Readonly<TimeSeriesUnit>[],
  ): Promise<SaveChartDataResult> {
    return { err: 'ok' };
  }
}

export default AdapterFile;
