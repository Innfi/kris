import {
  ReadStockDataResult,
  Snapshot,
  SnapshotMinimal,
  TimestampTypeEnum,
} from '../model';

export const parseStockDataMin = (
  symbol: string,
  interval: string,
  parsed: any,
): ReadStockDataResult => {
  const nameSeriesDaily = `Time Series (${interval})`;
  const nameOpen = '1. open';
  const nameHigh = '2. high';
  const nameLow = '3. low';
  const nameClose = '4. close';
  const nameVolume = '6. volume';

  try {
    const seriesDaily = parsed[nameSeriesDaily];

    const snapshotMins: SnapshotMinimal[] = Object.keys(seriesDaily).map(
      (value: string) => {
        const detailData = seriesDaily[value];

        return {
          x: new Date(value),
          y: [
            detailData[nameOpen],
            detailData[nameHigh],
            detailData[nameLow],
            detailData[nameClose],
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
        // snapshots,
        snapshotMins,
      },
    };
  } catch (err: any) {
    console.log(`parseStockData] err: ${err}`);
    return {
      err: 'intraday: parse failed',
    };
  }
};

export const parseStockData = (
  symbol: string,
  interval: string,
  parsed: any,
): ReadStockDataResult => {
  const nameSeriesDaily = `Time Series (${interval})`;
  const nameOpen = '1. open';
  const nameHigh = '2. high';
  const nameLow = '3. low';
  const nameClose = '4. close';
  const nameVolume = '6. volume';

  try {
    const seriesDaily = parsed[nameSeriesDaily];

    const snapshots: Snapshot[] = Object.keys(seriesDaily).map(
      (value: string) => {
        const detailData = seriesDaily[value];
        return {
          time: new Date(value),
          open: detailData[nameOpen],
          high: detailData[nameHigh],
          low: detailData[nameLow],
          close: detailData[nameClose],
          volume: detailData[nameVolume],
        };
      },
    );

    return {
      err: 'ok',
      stockData: {
        symbol,
        interval,
        timestampType: TimestampTypeEnum.DAILY,
        snapshots,
      },
    };
  } catch (err: any) {
    console.log(`parseStockData] err: ${err}`);
    return {
      err: 'intraday: parse failed',
    };
  }
};
