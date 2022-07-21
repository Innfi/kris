use crate::chart_loader::LoadChartInputTrait;

pub struct InputIntraday {
  timeseries_type: String,
  symbol: String,
  interval: String,
}
pub trait CreatorIntraday {
  fn new(symbol: String, interval: String) -> Self;
}

impl CreatorIntraday for InputIntraday {
  fn new(symbol: String, interval: String) -> Self {
    Self {
      timeseries_type: String::from("TIME_SERIES_INTRADAY"),
      symbol,
      interval,
    }
  }
}

impl LoadChartInputTrait for InputIntraday {
  fn to_descriptor(&self) -> String {
    format!("{}.{}.{}", self.symbol, self.timeseries_type, self.interval)
  }

  fn to_query_string(&self, prefix: String, apikey: String) -> String {
    format!(
      "{}?function={}&symbol={}&interval={}&apikey={}",
      prefix, self.timeseries_type, self.symbol, self.interval, apikey
    )
  }

  fn to_timeseries_key(&self) -> String {
    format!("Time Series ({})", self.interval)
  }
}
