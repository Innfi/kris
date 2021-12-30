import { Container, Service } from 'typedi';

import { LoadPortfolioResult, SavePortfolioResult } from '../model';
import AdapterBase from './adapter.base';
import PortRepositoryFactory from './factory';

const initializer =
  process.env.ENV === 'local'
    ? 'createRepositoryLocal'
    : 'createRepositoryCompose';

@Service({ factory: [PortRepositoryFactory, initializer] })
class PortRepository {
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
}

export default PortRepository;