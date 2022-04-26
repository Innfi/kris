import { Container } from 'typedi';

import { ParseStockDataResult, TimeSeriesUnit } from 'chart/model';
import TradyLogger from '../../common/logger';

const logger = Container.get(TradyLogger);

export const parseStockData = (
  timeSeriesKey: Readonly<string>,
  rawData: unknown,
): Readonly<ParseStockDataResult> => {
  const nameOpen = '1. open';
  const nameHigh = '2. high';
  const nameLow = '3. low';
  const nameClose = '4. close';
  // const nameVolume = '5. volume';

  try {
    const parsed: any = rawData;
    const seriesDaily = parsed[timeSeriesKey];

    const timeSeries: Readonly<TimeSeriesUnit>[] = Object.keys(seriesDaily).map(
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
      timeSeries,
    };
  } catch (err: unknown) {
    logger.error(`parseStockData] ${(err as Error).stack}`);
    return {
      err: 'parse failed',
    };
  }
};
