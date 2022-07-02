use log::info;

use stock_tracker::event_listener::start_event_listener;
use stock_tracker::startup::run_http_server;

async fn test_runner() {
  let result = start_event_listener();
  match result {
    Ok(()) => {}
    _ => {}
  }
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "actix_web=info,info");
  env_logger::init();
  
  info!("main from info!");

  tokio::spawn(async {
    test_runner().await
  });

  run_http_server()?.await
}
