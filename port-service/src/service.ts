import { Service } from 'typedi';

import { TradyLogger } from './common/logger';
import { EventListener, EventPayload } from './common/event/types';
import { LoadPortfolioResult, SavePortfolioResult } from './model';
import { PortRepository } from './repository';

@Service()
export class PortService implements EventListener {
  constructor(protected repo: PortRepository, protected logger: TradyLogger) {}

  // savePort
  async savePort(
    email: string,
    symbols: string[],
  ): Promise<SavePortfolioResult> {
    try {
      return await this.repo.savePortfolio(email, symbols);
    } catch (err: unknown) {
      this.logger.error(`PortService.savePort] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }

  // listPort
  async listPort(email: string): Promise<LoadPortfolioResult> {
    try {
      return await this.repo.loadPortfolio(email);
    } catch (err: unknown) {
      this.logger.error(`PortService.listPort] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }

  // handleEvent implements EventListener method
  handleEvent(payload: Readonly<EventPayload>) {
    this.logger.info(`payload: ${JSON.stringify(payload)}`);
  }
}
