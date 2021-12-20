import 'reflect-metadata';
import assert from 'assert';
import { Container } from 'typedi';

import {
  ReadStockDataResult,
  TimestampTypeEnum,
  WriteStockDataResult,
} from '../src/stat/model';
import StatRepository from '../src/stat/persistence/repository';
import {
  adapterRedis,
  setStockData,
  getStockData,
} from '../src/stat/persistence/adapter.redis';

describe('test redis', () => {
  it('basic behavior', async () => {
    await adapterRedis.connect();
    const statRepo = Container.get(StatRepository);

    const symbol = 'IBM';
    const interval = '60min';

    const result = await statRepo.loadIntraday(symbol, interval);

    const setResult: WriteStockDataResult = await setStockData(
      TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
      result.stockData!,
    );
    assert.strictEqual(setResult.err, 'ok');

    const getResult: ReadStockDataResult = await getStockData(
      TimestampTypeEnum.INTRADAY,
      symbol,
      interval,
    );
    assert.strictEqual(getResult.err, 'ok');
    assert.strictEqual(
      JSON.stringify(result.stockData),
      JSON.stringify(getResult.stockData),
    );
  });
});
