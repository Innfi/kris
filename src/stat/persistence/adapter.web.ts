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

  // getIntraday
  async getIntraday(symbol: string, interval: string): Promise<string> {
    const url: string = AdapterWeb.toIntradayUrl(this.timeSeriesIntraday, symbol, interval);
    const response = await axios.get(url);

    return response.data as string;
  }

  static toIntradayUrl(
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
    const url = AdapterWeb.toDailyUrl(this.timeSeriesDaily, symbol);
    const response = await axios.get(url);
    return response.data;
  }

  static toDailyUrl(
    type: string,
    symbol: string,
  ): string {
    return `${referenceUrl}`
      + `?function=${type}`
      + `&symbol=${symbol}`
      + `&apikey=${apiKey}`;
  }
}

export default AdapterWeb;
