import 'reflect-metadata';
import { Service } from 'typedi';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const referenceUrl = process.env.URL;
const apiKey = process.env.API_KEY;

function toIntradayUrl(
  type: string,
  code: string,
  interval: string,
): string {
  return `${referenceUrl}`
    + `?function=${type}`
    + `&symbol=${code}`
    + `&interval=${interval}`
    + `&apikey=${apiKey}`;
}

function toDailyUrl(
  type: string,
  code: string,
): string {
  return `${referenceUrl}`
    + `?function=${type}`
    + `&symbol=${code}`
    + `&apikey=${apiKey}`;
}

@Service()
class StatRepository {
  readonly timeSeriesIntraday = 'TIME_SERIES_INTRADAY';

  readonly timeSeriesDaily = 'TIME_SERIES_DAILY_ADJUSTED';

  // loadIntraday
  async loadIntraday(code: string, interval: string): Promise<any> {
    const response = await axios.get(
      toIntradayUrl(this.timeSeriesIntraday, code, interval),
    );
    return response.data;
  }

  // laodDaily
  async loadDaily(code: string): Promise<any> {
    const url = toDailyUrl(this.timeSeriesDaily, code);
    const response = await axios.get(url);
    return response.data;
  }
}

export default StatRepository;
