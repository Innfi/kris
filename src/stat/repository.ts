import 'reflect-metadata';
import { Service } from 'typedi';

import { ReadIntradayResult } from './model';
import AdapterFile from './adapter.file';
import AdapterWeb from './adapter.web';
import parseStockData from './stock.parser';

@Service()
class StatRepository {
  constructor(
    private adapterWeb: AdapterWeb,
    private adapterFile: AdapterFile,
  ) {}

  // loadIntraday
  async loadIntraday(
    symbol: string,
    interval: string,
  ): Promise<ReadIntradayResult> {
    const readResult: ReadIntradayResult = await this.adapterFile.readIntraday(symbol, interval);
    if (readResult.err === 'ok') {
      console.log('loadIntraday] read from file');
      return readResult;
    }

    // read stockData from web and transform
    const parsed: any = await this.adapterWeb.getIntraday(symbol, interval);
    if (!parsed) {
      return {
        err: 'invalid input',
      };
    }

    const result: ReadIntradayResult = parseStockData(symbol, interval, parsed);
    if (result.err !== 'ok') return result;

    await this.adapterFile.writeIntraday(symbol, interval, result.stockData);

    return result;
  }

  // loadDaily
  // async loadDaily(code: string): Promise<any> {

  // }
}

export default StatRepository;
