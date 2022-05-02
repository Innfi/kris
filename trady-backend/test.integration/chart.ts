import 'reflect-metadata';
import assert from 'assert';
import { Container } from 'typedi';

import { ChartRepository, LoadChartInputIntraday } from '../src/chart';

describe('chart.repository', () => {
  it('loadIntraday] check basic function', async () => {
    const repo = Container.get(ChartRepository);

    const input = new LoadChartInputIntraday('TWTR', '60min');

    const result = await repo.loadChartData(input);
    
    assert.strictEqual(result.err, 'ok');
    assert.notStrictEqual(result.chartData, undefined);
  });
});