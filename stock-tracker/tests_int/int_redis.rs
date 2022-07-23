use stock_tracker::chart_loader::ChartStorageRedis;

#[test]
fn run_chart_storage() {
  let chart_storage =
    ChartStorageRedis::new("redis://localhost:6379");

  let save_result = chart_storage.save_chart_data("hello", "world", 60);

  if save_result.is_err() {
    panic!("save failed");
  }
}
