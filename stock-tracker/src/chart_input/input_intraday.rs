use crate::chart_input::LoadChartInputTrait;

pub struct InputIntraday {
  timeseries_type: &'static str,
  symbol: String,
  interval: String,
}

impl InputIntraday {
  pub fn new(symbol: String, interval: String) -> Self {
    Self {
      timeseries_type: "TIME_SERIES_INTRADAY",
      symbol,
      interval,
    }
  }
}

impl LoadChartInputTrait for InputIntraday {
  fn to_descriptor(&self) -> String {
    format!("{}.{}.{}", self.symbol, self.timeseries_type, self.interval)
  }

  fn to_query_string(&self, prefix: &str, apikey: &str) -> String {
    format!(
      "{}?function={}&symbol={}&interval={}&apikey={}",
      prefix, self.timeseries_type, self.symbol, self.interval, apikey
    )
  }

  fn to_timeseries_key(&self) -> String {
    format!("Time Series ({})", self.interval)
  }

  fn to_lifetime_as_seconds(&self) -> usize {
    60 * 1
  }
}
