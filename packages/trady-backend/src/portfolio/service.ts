import { Service } from 'typedi';

import { LoadPortfolioResult, SavePortfolioResult } from './model';
import PortRepository from './persistence/repository';

@Service()
class PortService {
  constructor(protected repo: PortRepository) {}

  // savePort
  async savePort(
    email: string,
    symbols: string[],
  ): Promise<SavePortfolioResult> {
    return this.repo.savePortfolio(email, symbols);
  }

  // listPort
  async listPort(email: string): Promise<LoadPortfolioResult> {
    return this.repo.loadPortfolio(email);
  }
}

export default PortService;
