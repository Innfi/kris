import assert from 'assert';
import fs from 'fs';

import PortDict from '../src/portfolio/model';

describe('port: repository', () => {
  it('portfolio dictionary by file', () => {
    const dict: PortDict = {};
    dict['innfi@test.com'] = [];
    dict['innfi@test.com'].push('this');
    dict['innfi@test.com'].push('is');
    dict['innfi@test.com'].push('nothing');

    dict['ennfi@test.com'] = [];
    dict['ennfi@test.com'].push('that');
    dict['ennfi@test.com'].push('is');
    dict['ennfi@test.com'].push('also');
    dict['ennfi@test.com'].push('nothing');

    const filename = 'port/temp.json';
    fs.writeFileSync(filename, JSON.stringify(dict), 'utf-8');

    const rawData: string = fs.readFileSync(filename, 'utf-8');
    const otherDict: PortDict = JSON.parse(rawData);

    assert.strictEqual(otherDict['ennfi@test.com']
      .findIndex(value => value === 'is'), 1);
  });
});