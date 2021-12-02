import 'reflect-metadata';
import { Service } from 'typedi';
import dotenv from 'dotenv';

import { StockData } from 'stat/model';
import AdapterWeb from './adapter.web';
import { AdapterFile, ReadIntradayResult, WriteIntradayResult } from './adapter.file';

dotenv.config();

const referenceUrl = process.env.URL;
const apiKey = process.env.API_KEY;

@Service()
class StatRepository {
  constructor(
    private adapterWeb: AdapterWeb,
    private adapterFile: AdapterFile,
  ) {}

  // loadIntraday
  async loadIntraday(code: string, interval: string): Promise<StockData | undefined> {
    const readResult: ReadIntradayResult = await this.adapterFile.readIntraday(code, interval);
    if (readResult.err === 'ok') return readResult.stockData;

    // read stockData from web and transform
  }

  // loadDaily
  async loadDaily(code: string): Promise<any> {

  }
}

export default StatRepository;
