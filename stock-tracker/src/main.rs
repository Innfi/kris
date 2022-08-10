use log::info;

use stock_tracker::startup::run_http_server;
// use stock_tracker::configuration::load_configuration;
use stock_tracker::stock_event_new::EventRunner;

#[tokio::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "info");
  env_logger::init();

  info!("start stock_tracker");

  let mq_url: &str = "amqp://127.0.0.1:5672";
  let queue_name: &str = "trady_stock_register";
  let mut instance = EventRunner::new(mq_url);

  instance.init_channel(queue_name);
  instance.listen().await;

  run_http_server()?.await
}
