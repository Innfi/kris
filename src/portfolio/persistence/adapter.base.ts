import { LoadPortfolioResult, SavePortfolioResult } from 'portfolio/model';

interface AdapterBase {
  readUserPort(email: string): Promise<LoadPortfolioResult>;
  writeUserPort(email: string, symbols: string[]): Promise<SavePortfolioResult>;
}

export default AdapterBase;
