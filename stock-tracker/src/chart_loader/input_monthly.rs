use crate::chart_loader::{Creator, LoadChartInputTrait};

pub struct InputMonthly {
  timeseries_type: String,
  timeseries_key: String,
  symbol: String,
}

impl Creator for InputMonthly {
  fn new(symbol: String) -> Self {
    Self {
      timeseries_type: String::from("TIME_SERIES_MONTHLY"),
      timeseries_key: String::from("Monthly Time Series"),
      symbol,
    }
  }
}

impl LoadChartInputTrait for InputMonthly {
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
