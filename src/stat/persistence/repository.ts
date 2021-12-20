import { Service } from 'typedi';

import { ReadStockDataResult } from '../model';
import parseStockData from '../domain/stock.parser';
import AdapterFile from './adapter.file';
import AdapterWeb from './adapter.web';

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
  ): Promise<ReadStockDataResult> {
    const readResult: ReadStockDataResult = this.adapterFile.readIntraday(
      symbol,
      interval,
    );
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

    const parseResult: ReadStockDataResult = parseStockData(
      symbol,
      interval,
      parsed,
    );
    if (parseResult.err !== 'ok') return parseResult;

    this.adapterFile.writeIntraday(symbol, interval, parseResult.stockData);

    return parseResult;
  }

  // loadDaily
  // async loadDaily(code: string): Promise<any> {

  // }
}

export default StatRepository;
