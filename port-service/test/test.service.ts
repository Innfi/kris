import 'reflect-metadata';
import { Container } from 'typedi';
import assert from 'assert';

import { PortService } from '../src/service';

/*
tests for PortService

TODO
---------------------------------------------------------------------------
* test cleanup method
* mocking message queue for App
* integration test for production env

DONE
---------------------------------------------------------------------------
*/

describe('PortService', () => {
  it('save-load', async () => {
    const service = Container.get(PortService);

    const email = 'innfi@test.com';
    const symbols = ['TWTR', 'TSLA', 'RBLX'];

    const saveResult = await service.savePort(email, symbols);
    assert.strictEqual(saveResult.err, 'ok');

    const loadResult = await service.listPort(email);
    assert.strictEqual(loadResult.err, 'ok');
    assert.deepStrictEqual(loadResult.symbols, symbols);
  });
});