use stock_tracker::startup::run_http_server;

#[tokio::main]
async fn main() -> std::io::Result<()> {
  run_http_server()?.await
}
