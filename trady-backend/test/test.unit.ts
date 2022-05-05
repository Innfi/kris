import 'reflect-metadata';
import assert from 'assert';

import { parseStockData } from '../src/chart/domain/stock.parser';
import { LoadChartInputDaily } from '../src/chart/domain/input.daily';

const sampleData = {
  "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": "IBM",
      "3. Last Refreshed": "2022-05-02",
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern"
  },
  "Time Series (Daily)": {
      "2022-05-02": {
          "1. open": "133.0000",
          "2. high": "133.7700",
          "3. low": "130.8900",
          "4. close": "133.0400",
          "5. volume": "4213477"
      },
      "2022-04-29": {
          "1. open": "135.1300",
          "2. high": "135.5545",
          "3. low": "132.0000",
          "4. close": "132.2100",
          "5. volume": "5078660"
      },
      "2022-04-28": {
          "1. open": "136.8500",
          "2. high": "136.9900",
          "3. low": "134.8100",
          "4. close": "135.7400",
          "5. volume": "4477068"
      }
  }
}

const invalidKeyData = {
  "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": "IBM",
      "3. Last Refreshed": "2022-05-02",
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern"
  },
  "Time Series (Daily)": {
      "2022-04-28": {
          "open": "136.8500",
          "2. high": "136.9900",
          "3. low": "134.8100",
          "4. close": "135.7400",
          "5. volume": "4477068"
      }
  }
}

const invalidValueData = {
  "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": "IBM",
      "3. Last Refreshed": "2022-05-02",
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern"
  },
  "Time Series (Daily)": {
      "2022-04-28": {
          "1. open": "136.8500",
          "2. high": "136.9900",
          "3. low": "134.8100",
          "4. close": "abcd",
          "5. volume": "4477068"
      }
  }
}

describe('parseStockData', () => {
  it('returns error without source data', () => {
    const timeSeriesKey = new LoadChartInputDaily('IBM').toTimeSeriesKey();
    const rawData = undefined;

    const result = parseStockData(timeSeriesKey, rawData);

    assert.strictEqual(result.err, 'parse failed');
  });

  it('returns error for invalid key format', () => {
    const timeSeriesKey = new LoadChartInputDaily('IBM').toTimeSeriesKey();
    const rawData = invalidKeyData;

    const result = parseStockData(timeSeriesKey, rawData);

    assert.strictEqual(result.err, 'parse failed');
  });

  it('returns error for invalid value format', () => {
    const timeSeriesKey = new LoadChartInputDaily('IBM').toTimeSeriesKey();
    const rawData = invalidValueData;

    const result = parseStockData(timeSeriesKey, rawData);

    assert.strictEqual(result.err, 'parse failed');
  });


  it('returns ok for valid source', () => {
    const timeSeriesKey = new LoadChartInputDaily('IBM').toTimeSeriesKey();
    const rawData = sampleData;

    const result = parseStockData(timeSeriesKey, rawData);

    assert.strictEqual(result.err, 'ok');
  });
});
