import { Service } from 'typedi';

import { ReadStockDataResult, TimestampTypeEnum } from '../model';
import parseStockData from '../domain/stock.parser';
import DataReference from './data.ref';
import AdapterBase from './adapter.base';
import StatRepositoryFactory from './factory';

const initializer =
  process.env.ENV === 'local'
    ? 'createRepositoryLocal'
    : 'createRepositoryCompose';

@Service({ factory: [StatRepositoryFactory, initializer] })
class StatRepository {
  constructor(private dataRef: DataReference, private adapter: AdapterBase) {}

  // loadIntraday
  async loadIntraday(
    symbol: string,
    interval: string,
  ): Promise<ReadStockDataResult> {
    const readResult: ReadStockDataResult = await this.adapter.readStockData({
      type: TimestampTypeEnum.INTRADAY,
      symbol: symbol,
      interval: interval,
    });
    if (readResult.err === 'ok') {
      console.log(`loadIntraday] read from cache`);
      return readResult;
    }

    const parseResult: ReadStockDataResult = await this.loadIntradayFromWeb(
      symbol,
      interval,
    );
    if (parseResult.err !== 'ok') return parseResult;

    await this.adapter.writeStockData({
      type: TimestampTypeEnum.INTRADAY,
      symbol: symbol,
      interval: interval,
      stockData: parseResult.stockData!,
    });

    return parseResult;
  }

  protected async loadIntradayFromWeb(
    symbol: string,
    interval: string,
  ): Promise<ReadStockDataResult> {
    const parsed: string = await this.dataRef.getIntraday(symbol, interval);
    if (!parsed) {
      return {
        err: 'invalid input',
      };
    }

    return parseStockData(symbol, interval, parsed);
  }

  // loadDaily
  // async loadDaily(code: string): Promise<any> {

  // }
}

export default StatRepository;
