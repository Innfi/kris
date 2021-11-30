import { Service } from 'typedi';

import { StockData, TimestampTypeEnum } from 'stat/model';
import fs from 'fs';


export interface GetIntradayResult {
  err: string;
  stockData?: StockData;
};

@Service()
export class AdapterFile {
  readonly dataPath='./data/';

  //readIntraday
  async readIntraday(
    symbol: string, 
    interval: string
  ): Promise<GetIntradayResult> {
    const filename = this.toIntradayFilename(
      TimestampTypeEnum.INTRADAY,
      symbol, 
      interval, 
      );
    const effectiveFilePath = `${this.dataPath}${filename}`;
    if(!fs.existsSync(effectiveFilePath)) {
      return {
        err: 'getIntraday] file not found'
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

  protected toGetIntradayResult(rawData: string): GetIntradayResult {    
    try {
      return {
        err: 'ok', 
        stockData: JSON.parse(rawData) as StockData
      };
    } catch (err: any) {
      //TODO: logging;
      return {
        err: 'parse json failed'
      };
    }
  }

  //writeIntraday

};