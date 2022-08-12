pub trait LoadChartInputTrait {
  fn to_descriptor(&self) -> String;
  fn to_query_string(&self, prefix: &str, apikey: &str) -> String;
  fn to_timeseries_key(&self) -> String;
  fn to_lifetime_as_seconds(&self) -> usize;
}
