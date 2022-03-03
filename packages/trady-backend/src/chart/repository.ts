import { Container, Service } from 'typedi';

import TradyLogger from '../common/logger';
import { LoadChartDataResult } from './model';
import LoadChartInputBase from './domain/input.base';
import AdapterBase from './persistence/adapter.base';
import AdapterFile from './persistence/adapter.file';
import AdapterRedis from './persistence/adapter.redis';

const createRepositoryLocal = (): ChartRepository =>
  new ChartRepository(Container.get(AdapterFile), Container.get(TradyLogger));

const createRepositoryCompose = (): ChartRepository =>
  new ChartRepository(Container.get(AdapterRedis), Container.get(TradyLogger));

const initializer: CallableFunction =
  process.env.ENV === 'local' ? createRepositoryLocal : createRepositoryCompose;

@Service({ factory: initializer })
class ChartRepository {
  constructor(protected adapter: AdapterBase, protected logger: TradyLogger) {}

  // loadChartData
  async loadChartData(
    input: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>> {
    return this.adapter.readChartData(input);
  }
}

export default ChartRepository;
