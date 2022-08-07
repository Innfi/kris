use log::info;

use stock_tracker::startup::run_http_server;
// use stock_tracker::stock_event::start_event_listener;
use stock_tracker::configuration::load_configuration;
use stock_tracker::stock_event::EventRunner;

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "info");
  env_logger::init();

  info!("start stock_tracker");

  let conf = load_configuration().expect("failed to load conf");
  let mq_url = conf.message_queue.mq_url;
  let track_queue_name = conf.message_queue.track_request_queue.as_str();
  let mut event_runner = EventRunner::new(mq_url.as_str());
  event_runner.init_channel(track_queue_name);
  event_runner.try_consume().await;

  //let _ = start_event_listener().await;
  run_http_server()?.await
}
