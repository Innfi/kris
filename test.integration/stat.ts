import 'reflect-metadata';
import assert from 'assert';
import { Container } from 'typedi';

import { ReadIntradayResult } from '../src/stat/model';
import StatRepository from '../src/stat/repository';


describe('stat: persistence test', () => {
  it('file adapter: basic behavior', async () => {
    const testResult: ReadIntradayResult = {
      err: 'ok', 
    };

    assert.strictEqual(testResult !== undefined, true);
    const repo = Container.get(StatRepository);

    const readResult: ReadIntradayResult =
      await repo.loadIntraday('GME', '60min');

    assert.strictEqual(readResult.err, 'ok');

    console.log(JSON.stringify(readResult.stockData));
  });
});