import { Service } from 'typedi';
import axios from 'axios';
import dotenv from 'dotenv';

import TradyLogger from '../../common/logger';

dotenv.config();

const referenceUrl = process.env.URL;
const apiKey = process.env.API_KEY;

@Service()
class DataReference {
  readonly timeSeriesIntraday = 'TIME_SERIES_INTRADAY';

  readonly timeSeriesDaily = 'TIME_SERIES_DAILY_ADJUSTED';

  constructor(protected logger: TradyLogger) {}

  // getIntraday
  async getIntraday(symbol: string, interval: string): Promise<string> {
    const url: string = DataReference.toIntradayUrl(
      this.timeSeriesIntraday,
      symbol,
      interval,
    );
    const response = await axios.get(url);

    return response.data as string;
  }

  static toIntradayUrl(type: string, symbol: string, interval: string): string {
    return (
      `${referenceUrl}` +
      `?function=${type}` +
      `&symbol=${symbol}` +
      `&interval=${interval}` +
      `&apikey=${apiKey}`
    );
  }

  // getDaily
  async getDaily(symbol: string): Promise<any> {
    const url = DataReference.toDailyUrl(this.timeSeriesDaily, symbol);
    const response = await axios.get(url);
    return response.data;
  }

  static toDailyUrl(type: string, symbol: string): string {
    return (
      `${referenceUrl}` +
      `?function=${type}` +
      `&symbol=${symbol}` +
      `&apikey=${apiKey}`
    );
  }
}

export default DataReference;
