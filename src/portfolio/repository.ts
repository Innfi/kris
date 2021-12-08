import { Service } from 'typedi';

import { PortDict, LoadPortfolioResult } from './model';
import AdapterFile from './adapter.file';

@Service()
class PortRepository {
  constructor(private fileAdapter: AdapterFile) {}

  // loadPortfolio
  loadPortfolio(email: string): LoadPortfolioResult {
    return this.fileAdapter.readUserPort(email);
  }

  // savePortfolio
  //savePortfolio()
};

export default PortRepository;