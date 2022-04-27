import { Service } from 'typedi';
import fs from 'fs';

import { TradyLogger } from '../../common/logger';
import { LoadPortfolioResult, SavePortfolioResult } from '../model';
import { AdapterBase } from './adapter.base';

@Service()
export class AdapterFile implements AdapterBase {
  readonly dataPath = './port';

  constructor(protected logger: TradyLogger) {}

  // readUserPort
  async readUserPort(email: string): Promise<LoadPortfolioResult> {
    try {
      const effectiveFilePath = this.toEffectiveFilepath(email);
      if (!fs.existsSync(effectiveFilePath)) {
        return { err: 'readUserPort] file not found' };
      }

      const rawData = fs.readFileSync(effectiveFilePath, 'utf-8');
      const symbols: string[] = JSON.parse(rawData);

      return {
        err: 'ok',
        symbols,
      };
    } catch (err: unknown) {
      this.logger.error(`AdapterFile.readUserPort] ${(err as Error).stack}`);

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
    try {
      const effectiveFilePath = this.toEffectiveFilepath(email);

      fs.writeFileSync(effectiveFilePath, JSON.stringify(symbols), 'utf-8');

      return { err: 'ok' };
    } catch (err: unknown) {
      this.logger.error(`AdapterFile.writeUserPort] ${(err as Error).stack}`);

      return {
        err: 'write failed',
      };
    }
  }

  protected toEffectiveFilepath(email: string): string {
    return `${this.dataPath}/${email}.json`;
  }
}
