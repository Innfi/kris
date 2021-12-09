// export type PortDict = {
//   [email: string]: string[];
// };

export interface LoadPortfolioResult {
  err: string;
  symbols?: string[];
}

export interface SavePortfolioResult {
  err: string;
}
