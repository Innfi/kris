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
  async readStockData(
    input: Readonly<ReadStockDataInput>,
  ): Promise<Readonly<ReadStockDataResult>> {
    try {
      const { symbol, interval } = input;

      const effectiveFilePath = this.toEffectiveFilepath(symbol, interval);
      if (!fs.existsSync(effectiveFilePath)) {
        return { err: 'readIntraday] file not found' };
      }

      const rawData: string = fs.readFileSync(effectiveFilePath, 'utf-8');

      const stockData = JSON.parse(rawData) as StockData;

      return {
        err: 'ok',
        snapshots: stockData.snapshots,
      };
    } catch (err: unknown) {
      this.logger.error(`AdapterFile.readStockData] ${(err as Error).stack}`);

      return {
        err: 'parse json failed',
      };
    }
  }

  // writeIntraday
  async writeStockData(
    input: Readonly<WriteStockDataInput>,
  ): Promise<Readonly<WriteStockDataResult>> {
    try {
      const { symbol, interval, stockData } = input;

      if (!stockData) return { err: 'no stock data' };

      const effectiveFilePath = this.toEffectiveFilepath(symbol, interval);
      if (fs.existsSync(effectiveFilePath)) {
        return { err: 'writeIntraday] file exists' };
      }

      fs.writeFileSync(effectiveFilePath, JSON.stringify(stockData), 'utf8');
    } catch (err: unknown) {
      this.logger.error(`AdapterFile.writeStockData] ${(err as Error).stack}`);

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
