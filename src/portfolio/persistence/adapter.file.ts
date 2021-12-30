import { Service } from 'typedi';
import fs from 'fs';

import { LoadPortfolioResult, SavePortfolioResult } from '../model';
import AdapterBase from './adapter.base';

@Service()
class AdapterFile implements AdapterBase {
  readonly dataPath = './port';

  // readUserPort
  async readUserPort(email: string): Promise<LoadPortfolioResult> {
    const effectiveFilePath = this.toEffectiveFilepath(email);
    if (!fs.existsSync(effectiveFilePath)) {
      return { err: 'readUserPort] file not found' };
    }

    try {
      const rawData = fs.readFileSync(effectiveFilePath, 'utf-8');
      const symbols: string[] = JSON.parse(rawData);

      return {
        err: 'ok',
        symbols,
      };
    } catch (err: any) {
      // TODO: logging
      return {
        err: 'parse json failed',
      };
    }
  }

  // writeUserPort
  async writeUserPort(
    email: string,
    symbols: string[],
  ): Promise<SavePortfolioResult> {
    const effectiveFilePath = this.toEffectiveFilepath(email);

    fs.writeFileSync(effectiveFilePath, JSON.stringify(symbols), 'utf-8');

    return { err: 'ok' };
  }

  protected toEffectiveFilepath(email: string): string {
    return `${this.dataPath}/${email}.json`;
  }
}

export default AdapterFile;
