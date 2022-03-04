import { Service } from 'typedi';
import fs from 'fs';

import LoadChartInputBase from 'chart/domain/input.base';
import {
  ChartData,
  LoadChartDataResult,
  SaveChartDataResult,
  TimeSeriesUnit,
} from 'chart/model';
import TradyLogger from '../../common/logger';
import AdapterBase from './adapter.base';

@Service()
class AdapterFile implements AdapterBase {
  readonly dataPath = './data/';

  constructor(protected logger: TradyLogger) {}

  // readChartData
  async readChartData(
    key: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>> {
    try {
      const descriptor = key.toDescriptor();
      const path = `${this.dataPath}${descriptor}.json`;

      if (!fs.existsSync(path)) return { err: 'data unavailable' };

      const rawData: string = fs.readFileSync(path, 'utf-8');
      const timeSeries = JSON.parse(rawData) as TimeSeriesUnit[];

      return {
        err: 'ok',
        chartData: {
          descriptor,
          timeSeries,
        },
      };
    } catch (err: unknown) {
      this.logger.error(`AdapterFile.readChartData] ${(err as Error).stack}`);
      return { err: 'read failed' };
    }
  }

  // writeChartData
  async writeChartData(
    chartData: Readonly<ChartData>,
  ): Promise<SaveChartDataResult> {
    try {
      const path = `${this.dataPath}${chartData.descriptor}.json`;

      fs.writeFileSync(path, JSON.stringify(chartData.timeSeries), 'utf8');
    } catch (err: unknown) {
      this.logger.error(`AdapterFile.writeChartData] ${(err as Error).stack}`);
      return { err: 'write failed' };
    }

    return { err: 'ok' };
  }
}

export default AdapterFile;
