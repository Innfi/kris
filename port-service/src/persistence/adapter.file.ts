import { Service } from 'typedi';
import fs from 'fs';

import { TradyLogger } from '../common/logger';
import {
  ClearPortfolioResult,
  LoadPortfolioResult,
  SavePortfolioResult,
} from '../model';
import { AdapterBase } from './adapter.base';

@Service()
export class AdapterFile implements AdapterBase {
  readonly dataPath = './port';

  constructor(protected logger: TradyLogger) {
    this.initPortDirectory();
  }

  protected initPortDirectory() {
    if (fs.existsSync(this.dataPath)) return;

    fs.mkdirSync(this.dataPath);
  }

  // readUserPort
  async readUserPort(email: string): Promise<LoadPortfolioResult> {
    try {
      const effectivePath = this.toEffectiveFilepath(email);
      if (!fs.existsSync(effectivePath)) {
        return { err: 'readUserPort] file not found' };
      }

      const rawData = fs.readFileSync(effectivePath, 'utf-8');
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
      const effectivePath = this.toEffectiveFilepath(email);

      fs.writeFileSync(effectivePath, JSON.stringify(symbols), 'utf-8');

      return { err: 'ok' };
    } catch (err: unknown) {
      this.logger.error(`AdapterFile.writeUserPort] ${(err as Error).stack}`);

      return {
        err: 'write failed',
      };
    }
  }

  // clearUserPort
  async clearUserPort(email: string): Promise<ClearPortfolioResult> {
    try {
      const effectivePath = this.toEffectiveFilepath(email);

      fs.unlinkSync(effectivePath);

      return { err: 'ok' };
    } catch (err: unknown) {
      this.logger.error(`AdapterFile.clearUserPort] ${(err as Error).stack}`);

      return {
        err: 'clear failed',
      };
    }
  }

  protected toEffectiveFilepath(email: string): string {
    return `${this.dataPath}/${email}.json`;
  }
}
