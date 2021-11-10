import 'reflect-metadata';
import assert from 'assert';

import { Spot, SpotDetail } from '../src/model';

describe('test:unit', () => {
  it('parse json: simplest one', () => {
    const input = '{"2021-11-04 20:00:00":{"here":"there"}}';

    const spot: Spot = JSON.parse(input);
    assert.strictEqual(Object.keys(spot)[0], '2021-11-04 20:00:00');
  });

  it('parse json: variable keys under variable keys', () => {
    const input = '{"2021-11-04 20:00:00":{"1. open":"217.0000",'
      + '"2. high":"218.5000","3. low":"217.0000","4. close":"218.1000",'
      + '"5. volume":"3010"}}';

    const spot: Spot = JSON.parse(input);
    const timestampKey = '2021-11-04 20:00:00';
    const keyOpen = '4. close';
    const dataOpen = '218.1000';
    const detail: SpotDetail = spot[timestampKey];
    assert.strictEqual(detail[keyOpen], dataOpen);
  });
});
