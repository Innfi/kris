use log::{error, info};

use stock_tracker::event_listener::start_event_listener;
use stock_tracker::startup::run_http_server;

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "info");
  env_logger::init();

  info!("start stock_tracker");

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
