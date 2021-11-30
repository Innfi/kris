import { Service } from 'typedi';

import { StockData, TimestampTypeEnum } from 'stat/model';
import fs from 'fs';

export interface ReadIntradayResult {
  err: string;
  stockData?: StockData;
}

export interface WriteIntradayResult {
  err: string;
}

@Service()
export class AdapterFile {
  readonly dataPath = './data/';

  // readIntraday
  async readIntraday(
    symbol: string,
    interval: string,
  ): Promise<ReadIntradayResult> {
    const filename = this.toIntradayFilename(
      TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
    );
    const effectiveFilePath = `${this.dataPath}${filename}`;
    if (!fs.existsSync(effectiveFilePath)) {
      return {
        err: 'file not found',
      };
    }

    const rawData: string = fs.readFileSync(effectiveFilePath, 'utf-8');
    return this.toGetIntradayResult(rawData);
  }

  protected toIntradayFilename(
    type: TimestampTypeEnum,
    symbol: string,
    interval: string,
  ): string {
    return `${symbol}.${type.toString()}.${interval}.json`;
  }

  protected toGetIntradayResult(rawData: string): ReadIntradayResult {
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
  // suppose i don't need to sync this write call
  async writeIntraday(
    symbol: string,
    interval: string,
    stockData: StockData,
  ): Promise<WriteIntradayResult> {
    const filename = this.toIntradayFilename(
      TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
    );
    const effectiveFilePath = `${this.dataPath}${filename}`;

    try {
      fs.writeFileSync(effectiveFilePath, JSON.stringify(stockData), 'utf8');
    } catch (err: any) {
      return {
        err: 'file write failed',
      };
    }

    return {
      err: 'ok',
    };
  }
}
