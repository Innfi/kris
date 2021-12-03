import 'reflect-metadata';
import { Service } from 'typedi';

import { ReadIntradayResult, Snapshot, TimestampTypeEnum } from './model';
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
  ): Promise<ReadIntradayResult> {
    const readResult: ReadIntradayResult = await this.adapterFile.readIntraday(symbol, interval);
    if (readResult.err === 'ok') return readResult;

    // read stockData from web and transform
    const rawData: string = await this.adapterWeb.getIntraday(symbol, interval);
    if (!rawData) {
      return {
        err: 'invalid input',
      };
    }

    return StatRepository.toReadIntradayResult(symbol, rawData);
  }

  static toReadIntradayResult(
    symbol: string,
    rawData: string,
  ): ReadIntradayResult {
    const nameSeriesDaily = 'Time Series (Daily)';
    const nameOpen = '1. open';
    const nameHigh = '2. high';
    const nameLow = '3. low';
    const nameClose = '4. close';
    const nameVolume = '6. volume';

    try {
      console.log('------------------0-------------------');
      const parsed = JSON.parse(rawData);
      console.log('------------------1-------------------');
      const seriesDaily = parsed[nameSeriesDaily];
      console.log('------------------2-------------------');
      const snapshots: Snapshot[] = [];
      Object.keys(seriesDaily).forEach((value: string) => {
        const timestamp = new Date(value);
        console.log(`time: ${timestamp}`);
        const stockUnit = seriesDaily[value];
        snapshots.push({
          time: timestamp,
          open: stockUnit[nameOpen],
          high: stockUnit[nameHigh],
          low: stockUnit[nameLow],
          close: stockUnit[nameClose],
          volume: stockUnit[nameVolume],
        });
      });

      return {
        err: 'ok',
        stockData: {
          symbol,
          timestampType: TimestampTypeEnum.DAILY,
          snapshots,
        },
      };
    } catch (err: any) {
      // TODO: logging
      return {
        err: 'intraday: parse failed',
      };
    }
  }

  // loadDaily
  // async loadDaily(code: string): Promise<any> {

  // }
}

export default StatRepository;
