import { Container, Service } from 'typedi';

import { TradyLogger } from './common/logger';
import { ChartData, LoadChartDataResult, SaveChartDataResult } from './model';
import { LoadChartInputBase } from './chart-input/input.base';
import { AdapterBase } from './persistence/adapter.base';
import { AdapterFile } from './persistence/adapter.file';
import { AdapterRedis } from './persistence/adapter.redis';

const createRepositoryLocal = (): ChartRepository =>
  new ChartRepository(Container.get(AdapterFile), Container.get(TradyLogger));

const createRepositoryCompose = (): ChartRepository =>
  new ChartRepository(Container.get(AdapterRedis), Container.get(TradyLogger));

const initializer: CallableFunction =
  process.env.ENV === 'local' ? createRepositoryLocal : createRepositoryCompose;

@Service({ factory: initializer })
export class ChartRepository {
  constructor(protected adapter: AdapterBase, protected logger: TradyLogger) {}

  // loadChartData
  async loadChartData(
    input: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>> {
    return this.adapter.readChartData(input);
  }

  // saveChartData
  async saveChartData(
    chartData: Readonly<ChartData>,
  ): Promise<Readonly<SaveChartDataResult>> {
    return this.adapter.writeChartData(chartData);
  }
}
