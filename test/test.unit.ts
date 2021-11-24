import 'reflect-metadata';
import assert from 'assert';
import fs from 'fs';

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

  it('parse json: try with actual data', async () => {
    const input: string = fs.readFileSync('./test/data.json', 'utf-8');

    const parsedData = JSON.parse(input);

    //console.log(`test: ${parsedData["Time Series (Daily)"]["2021-11-23"]["1. open"]}`);
    assert.strictEqual(parsedData["Meta Data"]["2. Symbol"].toString(), 'IBM');

    //console.log(`meta: ${JSON.stringify(parsedData["Meta Data"])}`);
  });

  it('parse json: test with JSON.parse', () => {
    const input = '{"2021-11-04 20:00:00":{"1. open":"217.0000",'
      + '"2. high":"218.5000","3. low":"217.0000","4. close":"218.1000",'
      + '"5. volume":"3010"}}';

    const result = JSON.parse(input, (key: string, value: any): any => {
      console.log(`key: ${key}`);
      console.log(`value: ${value}`);

      return value;
    });
  });
});
