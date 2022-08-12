use stock_tracker::chart_input::{InputDaily, LoadChartInputTrait};

#[test]
fn to_timeseries_key() {
  let instance = InputDaily::new(String::from("TWTR"));

  assert_eq!(instance.to_timeseries_key().as_str(), "Time Series (Daily)");
}

#[test]
fn to_query_string() {
  let instance = InputDaily::new(String::from("IBM"));

  assert_eq!(
    instance
      .to_query_string("test_prefix", "key")
      .as_str(),
    "test_prefix?function=TIME_SERIES_DAILY&symbol=IBM&apikey=key"
  );
}
