import 'reflect-metadata';
import assert from 'assert';
import { Container } from 'typedi';

import ChartRepository from '../src/chart/persistence/repository';

describe('chart.repository', () => {
  it('loadIntraday] check basic function', async () => {
    const repo = Container.get(ChartRepository);
    const symbol = 'TWTR';
    const interval = '60min';

    const result = await repo.loadIntraday(symbol, interval);
    assert.strictEqual(result.err, 'ok');
    assert.notStrictEqual(result.snapshots, undefined);

    //console.log(`snapshot: ${JSON.stringify(result.snapshots)}`);
  });
});