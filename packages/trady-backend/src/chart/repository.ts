import { Service } from 'typedi';

import TradyLogger from '../common/logger';
import { LoadChartDataResult } from './model';
import LoadChartInputBase from './domain/input.base';

@Service()
class ChartRepository {
  constructor(protected logger: TradyLogger) {}
  //loadChartData
  async loadChartData(
    input: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>> {
    this.logger.info(`ChartRepository.loadChartData] `);

    return {
      err: 'ok',
    };
  }
}

export default ChartRepository;
