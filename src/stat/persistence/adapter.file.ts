import { Service } from 'typedi';
import fs from 'fs';

import {
  ReadIntradayResult, StockData, TimestampTypeEnum, WriteIntradayResult,
} from '../model';

@Service()
class AdapterFile {
  readonly dataPath = './data/';

  // readIntraday
  readIntraday(
    symbol: string,
    interval: string,
  ): ReadIntradayResult {
    const effectiveFilePath = this.toEffectiveFilepath(symbol, interval);
    if (!fs.existsSync(effectiveFilePath)) {
      return { err: 'readIntraday] file not found' };
    }

    const rawData: string = fs.readFileSync(effectiveFilePath, 'utf-8');
    return AdapterFile.toGetIntradayResult(rawData);
  }

  static toGetIntradayResult(rawData: string): ReadIntradayResult {
    try {
      return {
        err: 'ok',
        stockData: JSON.parse(rawData) as StockData,
      };
    } catch (err: any) {
      // TODO: logging;
      return {
        err: 'parse json failed',
      };
    }
  }

  // writeIntraday
  writeIntraday(
    symbol: string,
    interval: string,
    data?: StockData,
  ): WriteIntradayResult {
    if (!data) return { err: 'no stock data' };

    const effectiveFilePath = this.toEffectiveFilepath(symbol, interval);
    if (fs.existsSync(effectiveFilePath)) {
      return { err: 'writeIntraday] file exists' };
    }

    try {
      fs.writeFileSync(effectiveFilePath, JSON.stringify(data), 'utf8');
    } catch (error: any) {
      // TODO: logging
      return { err: 'file write failed' };
    }

    return { err: 'ok' };
  }

  protected toEffectiveFilepath(symbol: string, interval: string): string {
    const filename = AdapterFile.toIntradayFilename(
      TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
    );
    return `${this.dataPath}${filename}`;
  }

  static toIntradayFilename(
    type: TimestampTypeEnum,
    symbol: string,
    interval: string,
  ): string {
    return `${symbol}.${type.toString()}.${interval}.json`;
  }
}

export default AdapterFile;
