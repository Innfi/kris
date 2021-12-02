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
    interval: string
  ): Promise<ReadIntradayResult> {
    const effectiveFilePath = this.toEffectiveFilepath(symbol, interval);
    if(!fs.existsSync(effectiveFilePath)) {
      return { err: 'getIntraday] file not found' };
    }

    const rawData: string = fs.readFileSync(effectiveFilePath, 'utf-8');
    return this.toGetIntradayResult(rawData);
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

  //writeIntraday  
  async writeIntraday(
    symbol: string, 
    interval: string, 
    data: StockData,
  ): Promise<WriteIntradayResult> {
    const effectiveFilePath = this.toEffectiveFilepath(symbol, interval);
    if(fs.existsSync(effectiveFilePath)) {
      return { err: 'writeIntraday] file exists' };
    }

    try {
      fs.writeFileSync(effectiveFilePath, JSON.stringify(data), 'utf8');
    } catch(error: any) {
      //TODO: logging
      return { err: 'file write failed'};
    }

    return { err: 'ok' };
  }

  protected toEffectiveFilepath(symbol: string, interval: string): string {
    const filename = this.toIntradayFilename(
      TimestampTypeEnum.INTRADAY,
      symbol, 
      interval, 
    );
    return `${this.dataPath}${filename}`;
  }

  protected toIntradayFilename(
    type: TimestampTypeEnum, 
    symbol: string, 
    interval: string,
  ): string {
    return `${symbol}.${type.toString()}.${interval}.json`;
  }
}
