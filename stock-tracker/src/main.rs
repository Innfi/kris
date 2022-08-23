use futures::join;
use log::info;
// use tokio::signal;

use stock_tracker::chart_loader::ChartStorageRedis;
use stock_tracker::startup::run_http_server;
use stock_tracker::stock_event::{EventRunnerRabbitMQ, TrackRequestHandler};

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "info");
  env_logger::init();

  info!("start stock_tracker");
  let http_result = run_http_server();

  let storage_redis = ChartStorageRedis::new();
  let mut track_req_handler = TrackRequestHandler::new(&storage_redis);
  let mut event_runner = EventRunnerRabbitMQ::new(&mut track_req_handler);
  let event_runner_result = event_runner.process_event();

  // info!("before signal::ctrl_c()");
  // match signal::ctrl_c().await {
  //   Ok(()) => {
  //     return Ok(());
  //   },
  //   Err(err) => {
  //     error!("failed to wait signal: {}", err);
  //   },
  // }
  // info!("after signal::ctrl_c()");

  let _ = join!(http_result, event_runner_result);

  Ok(())
}
