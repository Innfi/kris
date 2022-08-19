use futures::join;
use log::info;

use stock_tracker::chart_loader::ChartStorageRedis;
use stock_tracker::configuration::StockTrackerConfs;
use stock_tracker::startup::run_http_server;
use stock_tracker::stock_event::{EventRunnerRabbitMQ, TrackRequestHandler};

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "info");
  env_logger::init();

  info!("start stock_tracker");
  let http_result = run_http_server()?;

  let stock_tracker_confs = StockTrackerConfs::new();
  let confs = stock_tracker_confs.get_conf();
  let mq_url = confs.message_queue.mq_url.as_str();
  let queue_name = confs.message_queue.track_request_queue.as_str();
  let emitter_queue_name = confs.message_queue.emitter_queue.as_str();
  let redis_url = confs.database.redis_url.as_str();

  let storage_redis = ChartStorageRedis::new(redis_url);
  let mut track_req_handler = TrackRequestHandler::new(&storage_redis);
  let mut event_runner =
    EventRunnerRabbitMQ::new(mq_url, &mut track_req_handler);

  let event_runner_result =
    event_runner.process_event(queue_name, emitter_queue_name);

  let _ = join!(http_result, event_runner_result);

  Ok(())
}
