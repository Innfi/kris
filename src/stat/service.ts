import PortRepository from 'portfolio/repository';
import { Service } from 'typedi';

import { LoadPortfolioResult } from '../portfolio/model';
import { LoadPortfolioStatsResult, ReadIntradayResult, StockData } from './model';
import StatRepository from './repository';

@Service()
class StatService {
  constructor(
    protected statRepo: StatRepository,
    protected portRepo: PortRepository,
  ) {}

  // loadIntraday
  async loadIntraday(
    symbol: string,
    interval: string,
  ): Promise<ReadIntradayResult> {
    try {
      return await this.statRepo.loadIntraday(symbol, interval);
    } catch (err: any) {
      // TODO: logging
      return { err };
    }
  }

  // loadIntradayByPort
  async loadIntradayByPort(
    email: string,
  ): Promise<LoadPortfolioStatsResult> {
    try {
      const loadResult: LoadPortfolioResult = await this.portRepo
        .loadPortfolio(email);
      if (loadResult.err !== 'ok') return { err: loadResult.err };

      const stats = await this.toStats(loadResult.symbols as string[]);

      return {
        err: 'ok',
        stockDataByPorts: stats,
      };
    } catch (err: any) {
      // TODO: logging
      return { err };
    }
  }

  protected async toStats(
    symbols: string[],
  ): Promise<StockData[]> {
    const stats: StockData[] = [];

    // FIXME
    const interval = '60min';

    for (const symbol of symbols) { //FIXME: eslint is against this loop
      const readResult: ReadIntradayResult = await this.statRepo
        .loadIntraday(symbol, interval);
      if (readResult.err !== 'ok') {
        // TODO: need decision for handling partial errors
        continue;
      }
      stats.push(readResult.stockData as StockData);
    }

    return stats;
  }
}

export default StatService;