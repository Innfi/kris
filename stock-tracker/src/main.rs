use log::info;

use stock_tracker::startup::run_http_server;
use stock_tracker::stock_event::start_event_listener;

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "info");
  env_logger::init();

  info!("start stock_tracker");

  let _ = start_event_listener().await;
  run_http_server()?.await
}
