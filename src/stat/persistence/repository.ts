import { Service } from 'typedi';

import { ReadStockDataResult, TimestampTypeEnum } from '../model';
import parseStockData from '../domain/stock.parser';
//import AdapterFile from './adapter.file';
import AdapterWeb from './adapter.web';
import { adapterRedis, setStockData, getStockData } from './adapter.redis';

@Service()
class StatRepository {
  constructor(
    private adapterWeb: AdapterWeb,
  ) //private adapterFile: AdapterFile,
  { }

  // loadIntraday
  async loadIntraday(
    symbol: string,
    interval: string,
  ): Promise<ReadStockDataResult> {
    //FIXME: interface

    // const readResult: ReadStockDataResult = this.adapterFile.readIntraday(
    //   symbol,
    //   interval,
    // );
    // if (readResult.err === 'ok') {
    //   console.log('loadIntraday] read from file');
    //   return readResult;
    // }
    let readResult: ReadStockDataResult = await getStockData(
      TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
    );
    if (readResult.err === 'ok') {
      console.log(`loadIntraday] read from cache`);
      return readResult;
    }

    const parseResult: ReadStockDataResult = await this.loadIntradayFromWeb(
      symbol,
      interval,
    );
    if (parseResult.err !== 'ok') return parseResult;

    //this.adapterFile.writeIntraday(symbol, interval, parseResult.stockData);
    await setStockData(
      TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
      parseResult.stockData!,
    );

    return parseResult;
  }

  protected async loadIntradayFromWeb(
    symbol: string,
    interval: string,
  ): Promise<ReadStockDataResult> {
    const parsed: string = await this.adapterWeb.getIntraday(symbol, interval);
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
