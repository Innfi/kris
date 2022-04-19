import 'reflect-metadata';
import assert from 'assert';
import { Container } from 'typedi';

import AdapterMongo from '../src/portfolio/persistence/adapter.mongo';
import AdapterRedis from '../src/chart/persistence/adapter.redis';
import StatRepository from '../src/chart/persistence/repository';
import { TimestampTypeEnum } from '../src/chart/model';

describe('adapter: mongodb', () => {
  const adapterMongo = Container.get(AdapterMongo);

  it('do write / read', async () => {
    adapterMongo.connect();

    const email = 'innfi@test.com';
    const symbols = [ 'GME', 'IBM', 'TSLA', 'CARA' ];

    const saveResult = await adapterMongo.writeUserPort(email, symbols);
    assert.strictEqual(saveResult.err, 'ok');

    const loadResult = await adapterMongo.readUserPort(email);
    assert.strictEqual(loadResult.err, 'ok');
    assert.deepStrictEqual(loadResult.symbols, symbols);
  });
});

describe('adapter: redis', () => {
  const adapterRedis = Container.get(AdapterRedis);

  it('basic behavior', async () => {
    const statRepo = Container.get(StatRepository);

    const symbol = 'IBM';
    const interval = '60min';

    const result = await statRepo.loadIntraday(symbol, interval);

    const writeResult = await adapterRedis.writeStockData({
      type: TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
      stockData: result.stockData!,
    });
    assert.strictEqual(writeResult.err, 'ok');

    const readResult = await adapterRedis.readStockData({
      type: TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
    });

    assert.strictEqual(readResult.err, 'ok');
    assert.strictEqual(
      JSON.stringify(result.stockData),
      JSON.stringify(readResult.stockData),
    );
  });
});