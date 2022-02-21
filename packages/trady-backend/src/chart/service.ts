import { Service } from 'typedi';

import TradyLogger from '../common/logger';
import { ReadStockDataResult } from './model';
import StatRepository from './persistence/repository';

@Service()
class StatService {
  constructor(
    protected statRepo: StatRepository,
    protected logger: TradyLogger,
  ) {}

  // loadIntraday
  async loadIntraday(
    symbol: Readonly<string>,
    interval: Readonly<string>,
  ): Promise<Readonly<ReadStockDataResult>> {
    try {
      return await this.statRepo.loadIntraday(symbol, interval);
    } catch (err: unknown) {
      this.logger.error(`StatService.loadIntraday] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }

  // loadDaily
  async loadDaily(
    symbol: Readonly<string>,
  ): Promise<Readonly<ReadStockDataResult>> {
    try {
      return await this.statRepo.loadDaily(symbol);
    } catch (err: unknown) {
      this.logger.error(`StatService.loadDaily] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }
}

export default StatService;
