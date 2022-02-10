import { Container, Service } from 'typedi';

import TradyLogger from '../../common/logger';
import { ReadStockDataResult, TimestampTypeEnum } from '../model';
import parseStockData from '../domain/stock.parser';
import DataReference from './data.ref';
import AdapterBase from './adapter.base';
import AdapterFile from './adapter.file';
import AdapterRedis from './adapter.redis';

const createRepositoryLocal = (): StatRepository =>
  new StatRepository(
    Container.get(DataReference),
    Container.get(AdapterFile),
    Container.get(TradyLogger),
  );

const createRepositoryCompose = (): StatRepository =>
  new StatRepository(
    Container.get(DataReference),
    Container.get(AdapterRedis),
    Container.get(TradyLogger),
  );

const initializer: CallableFunction =
  process.env.ENV === 'local' ? createRepositoryLocal : createRepositoryCompose;

@Service({ factory: initializer })
class StatRepository {
  constructor(
    private dataRef: DataReference,
    private adapter: AdapterBase,
    protected logger: TradyLogger,
  ) {}

  // loadIntraday
  async loadIntraday(
    symbol: string,
    interval: string,
  ): Promise<ReadStockDataResult> {
    const readResult: ReadStockDataResult = await this.adapter.readStockData({
      type: TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
    });
    if (readResult.err === 'ok') {
      this.logger.info(`loadIntraday] read from cache: ${symbol}:${interval}`);
      return readResult;
    }

    const parseResult: ReadStockDataResult = await this.loadIntradayFromWeb(
      symbol,
      interval,
    );
    if (parseResult.err !== 'ok') return parseResult;

    await this.adapter.writeStockData({
      type: TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
      stockData: parseResult.stockData!,
    });

    return parseResult;
  }

  protected async loadIntradayFromWeb(
    symbol: string,
    interval: string,
  ): Promise<ReadStockDataResult> {
    const rawData: unknown = await this.dataRef.getIntraday(symbol, interval);
    if (!rawData) {
      return {
        err: 'invalid input',
      };
    }

    return parseStockData(symbol, interval, rawData);
  }

  // loadDaily
  async loadDaily(symbol: string): Promise<ReadStockDataResult> {
    // FIXME
    return {
      err: 'ok',
    };
  }
}

export default StatRepository;
