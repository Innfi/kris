use crate::chart_input::LoadChartInputTrait;

pub struct InputWeekly {
  timeseries_type: &'static str,
  timeseries_key: &'static str,
  symbol: String,
}

impl InputWeekly {
  pub fn new(symbol: String) -> Self {
    Self {
      timeseries_type: "TIME_SERIES_WEEKLY",
      timeseries_key: "Weekly Time Series",
      symbol,
    }
  }
}

impl LoadChartInputTrait for InputWeekly {
  fn to_descriptor(&self) -> String {
    format!("{}.{}", self.symbol, self.timeseries_type)
  }

  fn to_query_string(&self, prefix: &str, apikey: &str) -> String {
    format!(
      "{}?function={}&symbol={}&apikey={}",
      prefix, self.timeseries_type, self.symbol, apikey
    )
  }

  fn to_timeseries_key(&self) -> String {
    self.timeseries_key.into()
  }

  fn to_lifetime_as_seconds(&self) -> usize {
    60 * 60 * 24 * 7
  }
}
