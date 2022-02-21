import { Service } from 'typedi';
import axios from 'axios';
import dotenv from 'dotenv';

import TradyLogger from '../../common/logger';

dotenv.config();

const referenceUrl = process.env.URL;
const apiKey = process.env.API_KEY;

const toIntradayUrl = (
  type: string,
  symbol: string,
  interval: string,
): string =>
  `${referenceUrl}` +
  `?function=${type}` +
  `&symbol=${symbol}` +
  `&interval=${interval}` +
  `&apikey=${apiKey}`;

const toDailyUrl = (type: string, symbol: string): string =>
  `${referenceUrl}` +
  `?function=${type}` +
  `&symbol=${symbol}` +
  `&apikey=${apiKey}`;

@Service()
class DataReference {
  readonly timeSeriesIntraday = 'TIME_SERIES_INTRADAY';

  readonly timeSeriesDaily = 'TIME_SERIES_DAILY_ADJUSTED';

  constructor(protected logger: TradyLogger) {}

  // getIntraday
  async getIntraday(symbol: string, interval: string): Promise<unknown> {
    const url: string = toIntradayUrl(
      this.timeSeriesIntraday,
      symbol,
      interval,
    );
    const response = await axios.get(url);

    return response.data;
  }

  // getDaily
  async getDaily(symbol: string): Promise<any> {
    const url = toDailyUrl(this.timeSeriesDaily, symbol);
    const response = await axios.get(url);
    return response.data;
  }
}

export default DataReference;
