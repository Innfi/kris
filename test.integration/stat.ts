import 'reflect-metadata';
import assert from 'assert';
import { Container } from 'typedi';
import fs from 'fs';

import { ReadIntradayResult, StockData } from '../src/stat/model';
import StatRepository from '../src/stat/repository';
import parseStockData from '../src/stat/stock.parser';


describe('stat: persistence test', () => {
  // it('file adapter: basic behavior', async () => {
  //   const testResult: ReadIntradayResult = {
  //     err: 'ok', 
  //   };

  //   assert.strictEqual(testResult !== undefined, true);
  //   const repo = Container.get(StatRepository);

  //   const readResult: ReadIntradayResult =
  //     await repo.loadIntraday('GME', '60min');

  //   assert.strictEqual(readResult.err, 'ok');

  //   console.log(JSON.stringify(readResult.stockData));
  // });

  it('repository: parse stock data', () => {
    const rawData: string = fs.readFileSync('./ex/gme.json', 'utf-8');

    const readResult: ReadIntradayResult = 
      parseStockData('GME', '60min', rawData);

    assert.strictEqual(readResult.err, 'ok');
    assert.strictEqual(readResult.stockData !== undefined, true);
  });
});