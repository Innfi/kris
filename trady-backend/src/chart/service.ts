import { Service } from 'typedi';

import { TradyLogger } from '../common/logger';
import { ChartData, LoadChartDataResult } from './model';
import { LoadChartInputBase } from './domain/input.base';
import { LoadChartInputIntraday } from './domain/input.intraday';
import { LoadChartInputDaily } from './domain/input.daily';
import { LoadChartInputWeekly } from './domain/input.weekly';
import { LoadChartInputMonthly } from './domain/input.monthly';
import { parseStockData } from './domain/stock.parser';
import { ChartRepository } from './repository';
import { getDataFromReference } from './persistence/data.ref';

@Service()
export class ChartService {
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

      return await this.loadChartData(input);
    } catch (err: unknown) {
      this.logger.error(`StatService.loadIntraday] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }

  // loadDaily
  async loadDaily(
    symbol: Readonly<string>,
  ): Promise<Readonly<LoadChartDataResult>> {
    try {
      const input: LoadChartInputBase = new LoadChartInputDaily(symbol);

      return await this.loadChartData(input);
    } catch (err: unknown) {
      this.logger.error(`StatService.loadDaily] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }

  // loadWeekly
  async loadWeekly(
    symbol: Readonly<string>,
  ): Promise<Readonly<LoadChartDataResult>> {
    try {
      const input: LoadChartInputBase = new LoadChartInputWeekly(symbol);

      return await this.loadChartData(input);
    } catch (err: unknown) {
      this.logger.error(`StatService.loadDaily] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }

  // loadWeekly
  async loadMonthly(
    symbol: Readonly<string>,
  ): Promise<Readonly<LoadChartDataResult>> {
    try {
      const input: LoadChartInputBase = new LoadChartInputMonthly(symbol);

      return await this.loadChartData(input);
    } catch (err: unknown) {
      this.logger.error(`StatService.loadDaily] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }

  protected async loadChartData(
    input: Readonly<LoadChartInputBase>,
  ): Promise<Readonly<LoadChartDataResult>> {
    const loadResult = await this.repo.loadChartData(input);
    if (loadResult.err === 'ok') return loadResult;

    const rawData = await getDataFromReference(input);
    const parseResult = parseStockData(input.toTimeSeriesKey(), rawData);
    if (parseResult.err !== 'ok') return { err: 'server error' };

    const chartData: Readonly<ChartData> = {
      descriptor: input.toDescriptor(),
      timeSeries: parseResult.timeSeries,
    };

    // temporary: write chart data via adapter
    await this.repo.saveChartData(chartData);

    return {
      err: 'ok',
      chartData,
    };
  }
}
