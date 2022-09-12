import { Container, Service } from 'typedi';

import { LoadChartDataResult } from '../model/model';
import { TradyLogger } from '../common/logger';
import { AdapterRedis } from './adapter.redis';
import { ChartRepositoryBase } from './repository.base';

const createRepository = (): ChartRepository =>
  new ChartRepository(Container.get(AdapterRedis), Container.get(TradyLogger));

@Service({ factory: createRepository })
export class ChartRepository implements ChartRepositoryBase {
  constructor(protected adapter: AdapterRedis, protected logger: TradyLogger) {}

  // loadChartData
  async loadChartData(key: string): Promise<Readonly<LoadChartDataResult>> {
    return this.adapter.readChartData(key);
  }
}
