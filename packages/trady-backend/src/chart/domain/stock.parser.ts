import { Container } from 'typedi';

import TradyLogger from '../../common/logger';
import { ReadStockDataResult, SnapshotUnit, TimestampTypeEnum } from '../model';

const logger = Container.get(TradyLogger);

export const parseStockData = (
  // symbol: Readonly<string>,
  // interval: Readonly<string>,
  timeSeriesKey: Readonly<string>,
  rawData: unknown,
): Readonly<ReadStockDataResult> => {
  // const nameTimeSeries = `Time Series (${interval})`;
  const nameOpen = '1. open';
  const nameHigh = '2. high';
  const nameLow = '3. low';
  const nameClose = '4. close';
  // const nameVolume = '5. volume';

  try {
    const parsed: any = rawData;
    const seriesDaily = parsed[timeSeriesKey];

    const snapshots: SnapshotUnit[] = Object.keys(seriesDaily).map(
      (value: string) => {
        const detailData = seriesDaily[value];

        return {
          x: new Date(value),
          y: [
            +detailData[nameOpen],
            +detailData[nameHigh],
            +detailData[nameLow],
            +detailData[nameClose],
          ],
        };
      },
    );

    return {
      err: 'ok',
      snapshots,
    };
  } catch (err: unknown) {
    logger.error(`parseStockData] ${(err as Error).stack}`);
    return {
      err: 'intraday: parse failed',
    };
  }
};
