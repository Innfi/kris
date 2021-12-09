import { Service } from 'typedi';

import { LoadPortfolioResult, SavePortfolioResult } from './model';
import AdapterFile from './adapter.file';

@Service()
class PortRepository {
  constructor(private fileAdapter: AdapterFile) {}

  // loadPortfolio
  loadPortfolio(email: string): LoadPortfolioResult {
    return this.fileAdapter.readUserPort(email);
  }

  // savePortfolio
  savePortfolio(email: string, symbols: string[]): SavePortfolioResult {
    return this.fileAdapter.writeUserPort(email, symbols);
  }
}

export default PortRepository;
