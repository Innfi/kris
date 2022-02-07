import { Container } from 'typedi';

import TradyLogger from '../../common/logger';
import {
  ReadStockDataResult,
  SnapshotMinimal,
  TimestampTypeEnum,
} from '../model';

const logger = Container.get(TradyLogger);

const parseStockData = (
  symbol: string,
  interval: string,
  rawData: unknown,
): ReadStockDataResult => {
  const nameSeriesDaily = `Time Series (${interval})`;
  const nameOpen = '1. open';
  const nameHigh = '2. high';
  const nameLow = '3. low';
  const nameClose = '4. close';
  // const nameVolume = '6. volume';

  try {
    //const parsed = JSON.parse(rawData);
    const parsed: any = rawData;
    const seriesDaily = parsed[nameSeriesDaily];

    const snapshotMins: SnapshotMinimal[] = Object.keys(seriesDaily).map(
      (value: string) => {
        const detailData = seriesDaily[value];

        return {
          x: new Date(value),
          y: [
            Number.parseFloat(detailData[nameOpen]),
            Number.parseFloat(detailData[nameHigh]),
            Number.parseFloat(detailData[nameLow]),
            Number.parseFloat(detailData[nameClose]),
          ],
        };
      },
    );

    return {
      err: 'ok',
      stockData: {
        symbol,
        interval,
        timestampType: TimestampTypeEnum.DAILY,
        snapshotMins,
      },
    };
  } catch (err: unknown) {
    logger.error(`parseStockData] ${(err as Error).stack}`);
    return {
      err: 'intraday: parse failed',
    };
  }
};

export default parseStockData;
