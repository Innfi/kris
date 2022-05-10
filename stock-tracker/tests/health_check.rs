use stock_tracker;

#[tokio::test]
async fn health_check_works() {
  spawn_app();
}

fn spawn_app() {
  let server = stock_tracker::run().expect("failed to bind address");

  let _ = tokio::spawn(server);
}