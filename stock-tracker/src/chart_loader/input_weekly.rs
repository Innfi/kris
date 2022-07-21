use crate::chart_loader::{Creator, LoadChartInputTrait};

pub struct InputWeekly {
  timeseries_type: String,
  timeseries_key: String,
  symbol: String,
}

impl Creator for InputWeekly {
  fn new(symbol: String) -> Self {
    Self {
      timeseries_type: String::from("TIME_SERIES_WEEKLY"),
      timeseries_key: String::from("Weekly Time Series"),
      symbol,
    }
  }
}

impl LoadChartInputTrait for InputWeekly {
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
