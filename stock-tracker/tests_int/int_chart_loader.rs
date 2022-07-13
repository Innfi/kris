use stock_tracker::chart_loader::{get_chart, Creator, InputDaily};

#[tokio::test]
async fn test_get_chart_has_response() {
  let input_daily = InputDaily::new(String::from("TWTR"));

  let result = get_chart(&input_daily).await;

  if result.is_err() {
    panic!("invalid result");
  }

  let response: String = result.unwrap();

  assert_eq!(response.is_empty(), false);
}
