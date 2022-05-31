export interface LoadPortfolioResult {
  err: string;
  symbols?: string[];
}

export interface AddPortfolioInput {
  email: string;
  symbols: string[];
}

export interface SavePortfolioResult {
  err: string;
}

export interface ClearPortfolioResult {
  err: string;
}
