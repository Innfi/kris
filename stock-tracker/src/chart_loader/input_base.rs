pub enum ChartType {
  Intraday,
  Daily,
  Weekly,
  Monthly,
}

pub trait LoadChartInputTrait {
  fn to_descriptor(&self) -> String;
  fn to_query_string(&self, prefix: String, apikey: String) -> String;
  fn to_timeseries_key(&self) -> String;
}

pub trait Creator {
  fn new(symbol: String) -> Self;
}
