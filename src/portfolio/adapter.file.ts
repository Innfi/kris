import { Service } from 'typedi';

import fs from 'fs';
import { PortDict, LoadPortfolioResult } from './model';

@Service() 
class AdapterFile {
  readonly dataPath = './port';

  // readUserPort
  readUserPort(email: string): LoadPortfolioResult {
    const effectiveFilePath = this.toEffectiveFilepath(email);
    if(!fs.existsSync(effectiveFilePath)) {
      return { err: 'readUserPort] file not found' };
    }

    const rawData: string = fs.readFileSync(effectiveFilePath, 'utf-8');

    return { err: 'ok' };
  }

  protected toEffectiveFilepath(email: string): string {
    return `${this.dataPath}/${email}.json`;
  }
};

export default AdapterFile;