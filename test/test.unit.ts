import 'reflect-metadata';
import assert from 'assert';
import fs from 'fs';

import { Snapshot } from '../src/stat/model';

const toSeconds = (interval: string): number => {
  const min = interval.replace('min', '');

  return Number.parseInt(min)*60;
};

describe('test:unit', () => {
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
