import { Container, Service } from 'typedi';

import {
  ClearPortfolioResult,
  LoadPortfolioResult,
  SavePortfolioResult,
} from './model';
import { AdapterBase } from './persistence/adapter.base';
import { AdapterFile } from './persistence/adapter.file';
import { AdapterMongo } from './persistence/adapter.mongo';

const createRepositoryLocal = (): PortRepository =>
  new PortRepository(Container.get(AdapterFile));

const createRepositoryCompose = (): PortRepository =>
  new PortRepository(Container.get(AdapterMongo));

const initializer: CallableFunction =
  process.env.ENV === 'local' ? createRepositoryLocal : createRepositoryCompose;

@Service({ factory: initializer })
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
