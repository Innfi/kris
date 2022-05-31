import {
  ClearPortfolioResult,
  LoadPortfolioResult,
  SavePortfolioResult,
} from '../model';

export interface AdapterBase {
  readUserPort(email: string): Promise<LoadPortfolioResult>;
  writeUserPort(email: string, symbols: string[]): Promise<SavePortfolioResult>;
  clearUserPort(email: string): Promise<ClearPortfolioResult>;
}
