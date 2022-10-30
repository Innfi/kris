use log::info;
use futures::join;

use stock_tracker::chart_loader::ChartStorageRedis;
use stock_tracker::stock_event::{EventRunnerRabbitMQ, TrackRequestHandler};
use stock_tracker::startup::run_http_server;
// use stock_tracker::common::{Logger, LogPayload};

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "info");
  env_logger::init();

  // let new_logger_instance = Logger::new("http://localhost:9200");
  // let _ = new_logger_instance.info(LogPayload {
  //   msg: "test log"
  // }).await;

  info!("start stock_tracker");
  let storage_redis = ChartStorageRedis::new();
  let mut track_req_handler = TrackRequestHandler::new(&storage_redis);
  let mut event_runner = EventRunnerRabbitMQ::new(&mut track_req_handler);
  let event_runner_result = event_runner.process_event();

  let _ = join!(event_runner_result, run_http_server()?);

  Ok(())
}
