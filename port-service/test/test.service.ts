import 'reflect-metadata';
import { Container } from 'typedi';
import assert from 'assert';
import { after } from 'mocha';

import { PortService } from '../src/service';

/* tests for PortService

TODO
---------------------------------------------------------------------------
* mocking message queue for App
* integration test for production env

DONE
---------------------------------------------------------------------------
* test cleanup method
*/

describe('PortService', () => {
  const service = Container.get(PortService);
  const emails: string[] = [];

  after(async () => {
    for (const email of emails) await service.clearPort(email);
  });

  it('save-load', async () => {
    const email = 'innfi@test.com';
    const symbols = ['TWTR', 'TSLA', 'RBLX'];
    emails.push(email);

    const saveResult = await service.savePort(email, symbols);
    assert.strictEqual(saveResult.err, 'ok');

    const loadResult = await service.listPort(email);
    assert.strictEqual(loadResult.err, 'ok');
    assert.deepStrictEqual(loadResult.symbols, symbols);
  });
});