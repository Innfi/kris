use log::{error, info};

use stock_tracker::configuration::load_configuration;
use stock_tracker::startup::run_http_server;
use stock_tracker::stock_event::start_event_listener;

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "info");
  env_logger::init();

  info!("start stock_tracker");

  let configurations = load_configuration().expect("failed to load conf");
  info!(
    "conf.redis: {}:{}",
    configurations.database.redis_host, configurations.database.redis_port
  );
  info!("message_queue: {}", configurations.message_queue.mq_url);

  tokio::spawn(async {
    let result = start_event_listener();
    match result {
      Ok(()) => {}
      other => {
        error!("event_listener error: {}", other.unwrap_err());
      }
    }
  });

  run_http_server()?.await
}
