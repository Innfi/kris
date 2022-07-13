use crate::chart_loader::{Creator, LoadChartInputTrait};

pub struct InputDaily {
  timeseries_type: String,
  timeseries_key: String,
  symbol: String,
}

impl Creator for InputDaily {
  fn new(symbol: String) -> Self {
    Self {
      timeseries_type: String::from("TIME_SERIES_DAILY"),
      timeseries_key: String::from("Time Series (Daily)"),
      symbol,
    }
  }
}

impl LoadChartInputTrait for InputDaily {
  fn to_descriptor(&self) -> String {
    format!("{}.{}", self.symbol, self.timeseries_type)
  }

  fn to_query_string(&self, prefix: String, apikey: String) -> String {
    format!(
      "{}?function={}&symbol={}&apikey={}",
      prefix, self.timeseries_type, self.symbol, apikey
    )
  }

  fn to_timeseries_key(&self) -> String {
    self.timeseries_key.clone()
  }
}
