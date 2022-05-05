import { Container } from 'typedi';

import { ParseStockDataResult, TimeSeriesUnit } from 'chart/model';
import { TradyLogger } from '../../common/logger';

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
    const timeSeriesValue = parsed[timeSeriesKey];

    const timeSeries: TimeSeriesUnit[] = Object.keys(timeSeriesValue).map(
      (value: string) => {
        const detailData = timeSeriesValue[value];

        const chartValue: number[] = [
          +detailData[nameOpen],
          +detailData[nameHigh],
          +detailData[nameLow],
          +detailData[nameClose],
        ];

        if (!chartValue.every(value => value)) {
          throw new Error('invalid chartValue');
        }

        return {
          x: new Date(value),
          y: chartValue,
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
