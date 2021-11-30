import { Service } from 'typedi';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const referenceUrl = process.env.URL;
const apiKey = process.env.API_KEY;

@Service()
class AdapterWeb {
  readonly timeSeriesIntraday = 'TIME_SERIES_INTRADAY';
  readonly timeSeriesDaily = 'TIME_SERIES_DAILY_ADJUSTED';

  constructor() {}

  // getIntraday
  async getIntraday(symbol: string, interval: string): Promise<any> {
    const response = await axios.get(
      this.toIntradayUrl(this.timeSeriesIntraday, symbol, interval),
    );
    return response.data;
  }

  protected toIntradayUrl(
    type: string,
    symbol: string,
    interval: string,
  ): string {
    return `${referenceUrl}`
      + `?function=${type}`
      + `&symbol=${symbol}`
      + `&interval=${interval}`
      + `&apikey=${apiKey}`;
  }

  // getDaily
  async getDaily(symbol: string): Promise<any> {
    const url = this.toDailyUrl(this.timeSeriesDaily, symbol);
    const response = await axios.get(url);
    return response.data;
  }

  protected toDailyUrl(
    type: string,
    symbol: string,
  ): string {
    return `${referenceUrl}`
      + `?function=${type}`
      + `&symbol=${symbol}`
      + `&apikey=${apiKey}`;
  }
};

export default AdapterWeb;