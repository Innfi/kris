import { LoadPortfolioResult, SavePortfolioResult } from 'portfolio/model';

export interface AdapterBase {
  readUserPort(email: string): Promise<LoadPortfolioResult>;
  writeUserPort(email: string, symbols: string[]): Promise<SavePortfolioResult>;
}
