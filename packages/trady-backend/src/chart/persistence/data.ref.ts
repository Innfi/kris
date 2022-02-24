import { Service } from 'typedi';
import axios from 'axios';

import TradyLogger from '../../common/logger';
import { toDailyUrl, toIntradayUrl } from 'chart/domain/searchkey.descriptor';

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
