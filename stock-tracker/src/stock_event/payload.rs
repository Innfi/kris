use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct EventPayloadTrackStock {
  pub chart_type: String,
  pub symbol: String,
  pub interval: String,
  // pub request_user: String,
}

#[derive(Serialize, Deserialize)]
pub struct EventPayloadTrackStockResponse {
  pub chart_type: String,
  pub symbol: String,
  pub err_message: String,
}
