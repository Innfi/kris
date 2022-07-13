use stock_tracker::chart_loader::{Creator, InputDaily, LoadChartInputTrait};

#[test]
fn test_to_timeseries_key() {
  let instance = InputDaily::new(String::from("TWTR"));

  assert_eq!(instance.to_timeseries_key().as_str(), "Time Series (Daily)");
}

#[test]
fn test_to_query_string() {
  let instance = InputDaily::new(String::from("IBM"));

  assert_eq!(
    instance
      .to_query_string(String::from("test_prefix"), String::from("key"))
      .as_str(),
    "test_prefix?function=TIME_SERIES_DAILY&symbol=IBM&apikey=key"
  );
}
