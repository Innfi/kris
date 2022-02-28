import 'reflect-metadata';
import assert from 'assert';
// import fs from 'fs';

// import { Snapshot } from '../src/stat/model';
import { SearchKeyDict } from '../src/chart/domain/searchkey.descriptor';

const toSeconds = (interval: string): number => {
  const min = interval.replace('min', '');

  return Number.parseInt(min, 10)*60;
};

describe('test:unit', () => {
  it('searchKeyDict: test element', () => {
    const param = 'world';
    const expectedResult = 'hello:world';

    const searchKeyDict: SearchKeyDict = {
      'Intraday': {
        timestampType: 'Intraday',
        keyName: 'TIME_SERIES_INTRADAY',
        toUrl: (param: string) => { return `hello:${param}`; },
      },
      'Daily': {
        timestampType: 'Daily',
        keyName: 'TIME_SERIES_DAILY',
        toUrl: () => { return 'not this' },
      },
    };
    
    const descriptor = searchKeyDict['Intraday'];
    const result = descriptor.toUrl(param);
    assert.strictEqual(result, expectedResult);
  });


  // it('parse json: to machine-friendly values', () => {
  //   const input: string = fs.readFileSync('./test/sample.json', 'utf-8');
  //   const rawData = JSON.parse(input);
  //   const seriesDailyKey = 'Time Series (Daily)';
  //   const seriesDaily = rawData[seriesDailyKey];

  //   const dates: string[] = Object.keys(seriesDaily);
  //   const snapshots: Snapshot[] = dates.map((value: string) => {
  //     const detailData = seriesDaily[value];
  //     return {
  //       time: new Date(value),
  //       open: detailData['1. open'],
  //       high: detailData['2. high'],
  //       low: detailData['3. low'],
  //       close: detailData['4. close'],
  //       volume: detailData['5. volume'],
  //     };
  //   });

  //   assert.strictEqual(snapshots.length > 0, true);
  // });

  it('toSeconds', () => {
    assert.strictEqual(toSeconds('60min'), 3600);
  });
});
