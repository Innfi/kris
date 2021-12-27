import 'reflect-metadata';
import assert from 'assert';
import { Container } from 'typedi';
import { LoadPortfolioResult, SavePortfolioResult } from '../src/portfolio/model';

import AdapterMongo from '../src/portfolio/persistence/adapter.mongo';

describe('mongo: adapter', () => {
  const adapterMongo = Container.get(AdapterMongo);

  it('do write / read', async () => {
    adapterMongo.connect();

    const email = 'innfi@test.com';
    const symbols = [ 'GME', 'IBM', 'TSLA', 'CARA' ];

    const saveResult: SavePortfolioResult = await adapterMongo.writeUserPort(email, symbols);
    assert.strictEqual(saveResult.err, 'ok');

    const loadResult: LoadPortfolioResult = await adapterMongo.readUserPort(email);
    assert.strictEqual(loadResult.err, 'ok');
    assert.deepStrictEqual(loadResult.symbols, symbols);
  });
});