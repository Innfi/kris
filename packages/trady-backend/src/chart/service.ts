import { Service } from 'typedi';

import TradyLogger from '../common/logger';
import { LoadChartDataResult } from './model';
import LoadChartInputBase from './domain/input.base';
import LoadChartInputIntraday from './domain/input.intraday';
import ChartRepository from './repository';

@Service()
class ChartService {
  constructor(protected repo: ChartRepository, protected logger: TradyLogger) {}

  // loadIntraday
  async loadIntraday(
    symbol: Readonly<string>,
    interval: Readonly<string>,
  ): Promise<Readonly<LoadChartDataResult>> {
    try {
      const input: LoadChartInputBase = new LoadChartInputIntraday(
        symbol,
        interval,
      );
      const loadResult = await this.repo.loadChartData(input);
      if (loadResult.err === 'ok') return loadResult;

      return {
        err: 'ok',
      };
    } catch (err: unknown) {
      this.logger.error(`StatService.loadIntraday] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }

  // // loadDaily
  // async loadDaily() {
  //   try {

  //   } catch (err: unknown) {
  //     this.logger.error(`StatService.loadDaily] ${(err as Error).stack}`);
  //     return { err: 'server error' };
  //   }
  // }
}

export default ChartService;
