import { Service } from 'typedi';
import fs from 'fs';

import TradyLogger from '../../common/logger';
import {
  ReadStockDataInput,
  ReadStockDataResult,
  StockData,
  TimestampTypeEnum,
  WriteStockDataInput,
  WriteStockDataResult,
} from '../model';
import AdapterBase from './adapter.base';

const toIntradayFilename = (
  type: TimestampTypeEnum,
  symbol: string,
  interval: string,
): string => `${symbol}.${type.toString()}.${interval}.json`;

@Service()
class AdapterFile implements AdapterBase {
  readonly dataPath = './data/';

  constructor(protected logger: TradyLogger) {}

  // readIntraday
  async readStockData(input: ReadStockDataInput): Promise<ReadStockDataResult> {
    const { symbol, interval } = input;

    const effectiveFilePath = this.toEffectiveFilepath(symbol, interval);
    if (!fs.existsSync(effectiveFilePath)) {
      return { err: 'readIntraday] file not found' };
    }

    const rawData: string = fs.readFileSync(effectiveFilePath, 'utf-8');
    return AdapterFile.toGetIntradayResult(rawData);
  }

  static toGetIntradayResult(rawData: string): ReadStockDataResult {
    try {
      return {
        err: 'ok',
        stockData: JSON.parse(rawData) as StockData,
      };
    } catch (err: unknown) {
      // TODO: logging;

      return {
        err: 'parse json failed',
      };
    }
  }

  // writeIntraday
  async writeStockData(
    input: WriteStockDataInput,
  ): Promise<WriteStockDataResult> {
    const { symbol, interval, stockData } = input;

    if (!stockData) return { err: 'no stock data' };

    const effectiveFilePath = this.toEffectiveFilepath(symbol, interval);
    if (fs.existsSync(effectiveFilePath)) {
      return { err: 'writeIntraday] file exists' };
    }

    try {
      fs.writeFileSync(effectiveFilePath, JSON.stringify(stockData), 'utf8');
    } catch (error: unknown) {
      // TODO: logging
      return { err: 'file write failed' };
    }

    return { err: 'ok' };
  }

  protected toEffectiveFilepath(symbol: string, interval: string): string {
    const filename = toIntradayFilename(
      TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
    );
    return `${this.dataPath}${filename}`;
  }
}

export default AdapterFile;
