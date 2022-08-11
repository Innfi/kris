use log::info;

use stock_tracker::configuration::load_configuration;
use stock_tracker::startup::run_http_server;
use stock_tracker::stock_event::EventRunnerRabbitMQ;

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "info");
  env_logger::init();

  info!("start stock_tracker");

  let confs = load_configuration().expect("load_configuration failed");
  let mq_url = confs.message_queue.mq_url.as_str();
  let queue_name = confs.message_queue.track_request_queue.as_str();

  let _ = run_http_server()?;

  let mut event_runner = EventRunnerRabbitMQ::new(mq_url);
  let _ = event_runner.process_event(queue_name).await;

  Ok(())
}
