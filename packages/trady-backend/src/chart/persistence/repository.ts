import { Container, Service } from 'typedi';

import TradyLogger from '../../common/logger';
import { ReadStockDataResult, TimestampTypeEnum } from '../model';
import { parseStockData } from '../domain/stock.parser';
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
    symbol: Readonly<string>,
    interval: Readonly<string>,
  ): Promise<Readonly<ReadStockDataResult>> {
    let readResult: ReadStockDataResult = await this.adapter.readStockData({
      type: TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
    });
    if (readResult.err === 'ok') {
      this.logger.info(`loadIntraday] read from cache: ${symbol}:${interval}`);
      return readResult;
    }

    readResult = await this.loadIntradayFromWeb(
      symbol,
      interval,
    );
    if (readResult.err !== 'ok') return readResult;

    await this.adapter.writeStockData({
      type: TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
      stockData: {
        symbol,
        interval,
        timestampType: TimestampTypeEnum.INTRADAY,
        snapshots: readResult.snapshots,
      },
    });

    return readResult;
  }

  protected async loadIntradayFromWeb(
    symbol: Readonly<string>,
    interval: Readonly<string>,
  ): Promise<Readonly<ReadStockDataResult>> {
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
