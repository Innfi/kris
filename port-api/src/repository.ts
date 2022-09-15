import { Container, Service } from 'typedi';

import {
  ClearPortfolioResult,
  LoadPortfolioResult,
  SavePortfolioResult,
} from './model';
import { AdapterBase } from './persistence/adapter.base';
import { AdapterMongo } from './persistence/adapter.mongo';

const createRepository = (): PortRepository =>
  new PortRepository(Container.get(AdapterMongo));

@Service({ factory: createRepository })
export class PortRepository {
  constructor(private adapter: AdapterBase) {}

  // loadPortfolio
  async loadPortfolio(email: string): Promise<LoadPortfolioResult> {
    return this.adapter.readUserPort(email);
  }

  // savePortfolio
  async savePortfolio(
    email: string,
    symbols: string[],
  ): Promise<SavePortfolioResult> {
    return this.adapter.writeUserPort(email, symbols);
  }

  // clearPortfolio
  async clearPortfolio(email: string): Promise<ClearPortfolioResult> {
    return this.adapter.clearUserPort(email);
  }
}
